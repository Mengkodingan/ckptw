import makeWASocket, {
    Browsers,
  DisconnectReason,
  downloadContentFromMessage,
  getContentType,
  proto,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { AuthenticationState, ConnectionState, WABrowserDescription, WACallEvent } from "@whiskeysockets/baileys/lib/Types";

import { Boom } from "@hapi/boom";
import pino from "pino";
import EventEmitter from "events";
import { Events } from "../Constant/Events";
import { Collection } from "@discordjs/collection";
import { IClientOptions, ICommandOptions, IMessageInfo } from "../Common/Types";
import { Ctx } from "./Ctx";
import { decodeJid, getContentFromMsg } from "../Common/Functions";
import { MessageEventList } from "../Handler/MessageEvents";
import { PHONENUMBER_MCC } from "../Constant/PHONENUMBER_MCC";
import { Consolefy } from "@mengkodingan/consolefy";
import ExtractEventsContent from "../Handler/ExtractEventsContent";
 
export class Client {
    prefix: Array<string> | string | RegExp;
    readIncommingMsg?: boolean;
    authDir?: string;
    printQRInTerminal?: boolean;
    state?: AuthenticationState;
    saveCreds: any;
    core!: ReturnType<typeof makeWASocket>;
    ev: EventEmitter;
    cmd?: Collection<ICommandOptions | number, any>;
    cooldown?: Collection<unknown, unknown>;
    middlewares?: Collection<number, (ctx: Ctx, next: () => Promise<void>) => any>;
    readyAt?: number;
    hearsMap: Collection<number, any>;
    qrTimeout?: number;
    markOnlineOnConnect?: boolean;
    logger?: any;
    phoneNumber?: string;
    usePairingCode?: boolean;
    selfReply?: boolean;
    WAVersion?: [number, number, number];
    autoMention?: boolean;
    fallbackWAVersion: [number, number, number];
    authAdapter?: Promise<any>;
    consolefy?: Consolefy;
    browser?: WABrowserDescription;

    constructor(opts: IClientOptions) {   
        this.prefix = opts.prefix;
        this.readIncommingMsg = opts.readIncommingMsg ?? false;
        this.authDir = opts.authDir ?? './state';
        this.printQRInTerminal = opts.printQRInTerminal ?? true;
        this.phoneNumber = opts.phoneNumber;
        this.usePairingCode = opts.usePairingCode ?? false;
        this.qrTimeout = opts.qrTimeout ?? 60000
        this.markOnlineOnConnect = opts.markOnlineOnConnect ?? true;
        this.logger = opts.logger ?? pino({ level: "fatal" });
        this.selfReply = opts.selfReply ?? false;
        this.WAVersion = opts.WAVersion;
        this.autoMention = opts.autoMention ?? false;
        this.fallbackWAVersion = [2, 3000, 1021387508];
        this.authAdapter = opts.authAdapter ?? useMultiFileAuthState(this.authDir as string);
        this.browser = opts.browser ?? Browsers.ubuntu('CHROME');

        this.ev = new EventEmitter();
        this.cmd = new Collection();
        this.cooldown = new Collection();
        this.hearsMap = new Collection();
        this.middlewares = new Collection();

        this.consolefy = new Consolefy();

        if(typeof this.prefix === "string") this.prefix = this.prefix.split('');
    }

    onConnectionUpdate() {
        this.core?.ev.on('connection.update', (update: Partial<ConnectionState>) => {
            this.ev.emit(Events.ConnectionUpdate, update);
            const { connection, lastDisconnect } = update;
            
            if(update.qr) this.ev.emit(Events.QR, update.qr);

            if(connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
                this.consolefy?.error('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)
                if(shouldReconnect) this.launch();
            } else if(connection === 'open') {
                this.readyAt = Date.now();
                this.ev?.emit(Events.ClientReady, this.core);
            }
        });
    }

    onCredsUpdate() {
        this.core?.ev.on("creds.update", this.saveCreds);
    }

    read(m: IMessageInfo) {
        this.core?.readMessages([
            {
              remoteJid: m.key.remoteJid,
              id: m.key.id,
              participant: m.key.participant
            },
        ]);
    }

    use(fn: (ctx: Ctx, next: () => Promise<void>) => any) {
        this.middlewares?.set(this.middlewares.size, fn);
    }

    async runMiddlewares(ctx: Ctx, index = 0): Promise<boolean> {
        const middlewareFn = this.middlewares?.get(index);
        if (!middlewareFn) return true;
        
        let nextCalled = false;
        let chainCompleted = false;
        
        await middlewareFn(ctx, async () => {
            nextCalled = true;
            chainCompleted = await this.runMiddlewares(ctx, index + 1);
        });
        
        return nextCalled && chainCompleted;
    }

    onMessage() {
        this.core?.ev.on("messages.upsert", async (m: any) => {
            let msgType = getContentType(m.messages[0].message) as string;
            let text = getContentFromMsg(m.messages[0]);

            m.content = null;
            if(text?.length) m.content = text;

            m.messageType = msgType;
            m = { ...m, ...m.messages[0] }

            delete m.messages;
            let self = { ...this, getContentType, downloadContentFromMessage, proto, m };
            let used = ExtractEventsContent(m, msgType);
            let ctx = new Ctx({ used, args: [], self, client: this.core });
            
            if (MessageEventList[msgType]) {
                await MessageEventList[msgType](m, this.ev, self, this.core);
            }

            this.ev?.emit(Events.MessagesUpsert, m, ctx);
            if (this.readIncommingMsg) this.read(m);
            await require('../Handler/Commands')(self, this.runMiddlewares.bind(this));
        });
    }

    onGroupParticipantsUpdate() {
        this.core?.ev.on("group-participants.update", async (m: { action: string; }) => {
            if (m.action === "add") return this.ev.emit(Events.UserJoin, m);
            if (m.action === "remove") return this.ev.emit(Events.UserLeave, m);
        });
    }

    onGroupsJoin() {
        this.core?.ev.on('groups.upsert', (m: any) => {
            this.ev.emit(Events.GroupsJoin, m)
        });
    }

    onCall() {
        this.core?.ev.on('call', (m: WACallEvent[]) => {
            let withDecodedId = m.map(v => ({ ...v, decodedFrom: decodeJid(v.from), decodedChatId: decodeJid(v.chatId) }));
            this.ev.emit(Events.Call, withDecodedId);
        });
    }

    /**
     * Create a new command.
     * @param opts Command options object or command name string. 
     * @param code If the first parameter is a command name as a string, then you should create a callback function in second parameter.
     * @example
     * ```
     * bot.command('ping', async(ctx) => ctx.reply({ text: 'Pong!' }));
     * 
     * // same as
     * 
     * bot.command({
     *     name: 'ping',
     *     code: async(ctx) => {
     *         ctx.reply('Pong!');
     *     }
     * });
     * ```
     */
    command(opts: ICommandOptions | string, code?: (ctx: Ctx) => Promise<any>) {
        if(typeof opts !== 'string') return this.cmd?.set(this.cmd.size, opts);

        if(!code) code = async() => { return null; };
        return this.cmd?.set(this.cmd.size, { name: opts, code });
    }

    /**
     * "Callback" will be triggered when someone sends the "query" in the chats. Hears function like command but without command prefix.
     * @param query The trigger.
     * @param callback Callback function
     */
    hears(query: string | Array<string> | RegExp, callback: (ctx: Ctx) => Promise<any>) {
        this.hearsMap.set(this.hearsMap.size, { name: query, code: callback });
    }

    /**
     * Set the bot bio/about.
     * @param content The bio content.
     */
    bio(content: string) {
        this.core?.query({
          tag: "iq",
          attrs: {
            to: "@s.whatsapp.net",
            type: "set",
            xmlns: "status",
          },
          content: [
            {
              tag: "status",
              attrs: {},
              content,
            },
          ],
        });
    }

    /**
     * Fetch bio/about from given Jid or if the param empty will fetch the bot bio/about.
     * @param [jid] the jid.
     */
    async fetchBio(jid?: string) {
        let decodedJid = decodeJid(jid ? jid : this.core?.user?.id as string)
        let re = await this.core?.fetchStatus(decodedJid);
        return re;
    }

    /**
     * All the groups that the bot joins.
     */
    async groups() {
        return await this.core.groupFetchAllParticipating();
    }

    decodeJid(jid: string) {
        return decodeJid(jid)
    }

    async launch() {
        const { state, saveCreds } = await this.authAdapter;
        this.state = state;
        this.saveCreds = saveCreds;

        const version = this.WAVersion ? this.WAVersion : this.fallbackWAVersion;
        this.core = makeWASocket({
            logger: this.logger as any,
            printQRInTerminal: this.printQRInTerminal,
            auth: this.state!,
            browser: this.browser,
            version,
            qrTimeout: this.qrTimeout,
            markOnlineOnConnect: this.markOnlineOnConnect
        });

        if(this.usePairingCode && !this.core.authState.creds.registered) {
            this.consolefy?.setTag("pairing-code");
            if(this.printQRInTerminal) {
                this.consolefy?.error("If you are set the usePairingCode to true then you need to set printQRInTerminal to false.");
                this.consolefy?.resetTag();

                return;
            }

            if(!this.phoneNumber) {
                this.consolefy?.error("The phoneNumber options are required if you are using usePairingCode.");
                this.consolefy?.resetTag();

                return;
            }

            this.phoneNumber = this.phoneNumber.replace(/[^0-9]/g, '');
            if(!this.phoneNumber.length) {
                this.consolefy?.error("Invalid phoneNumber.");
                this.consolefy?.resetTag();

                return;
            }

            if(!PHONENUMBER_MCC.some(v => this.phoneNumber!.startsWith(v))) {
                this.consolefy?.error("phoneNumber format must be like: 62xxx (starts with the country code).");
                this.consolefy?.resetTag();

                return;
            }

            setTimeout(async () => {
                const code = await this.core.requestPairingCode(this.phoneNumber!);
                this.consolefy?.info(`Pairing Code: ${code}`);
                this.consolefy?.resetTag();

            }, 3000)
        }

        this.onConnectionUpdate();
        this.onCredsUpdate();
        this.onMessage();
        this.onGroupParticipantsUpdate();
        this.onGroupsJoin();
        this.onCall();
    }
}