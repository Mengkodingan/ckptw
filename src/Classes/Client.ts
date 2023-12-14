import makeWASocket, {
  DisconnectReason,
  getContentType,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { AuthenticationState } from "@whiskeysockets/baileys/lib/Types";

import { Boom } from "@hapi/boom";
import pino from "pino";
import { request } from "undici";
import EventEmitter from "events";
import { Events } from "../Constant/Events";
import { Collection } from "@discordjs/collection";
import { ClientOptions, CommandOptions } from "../Common/Types";
import { Ctx } from "./Ctx";
import { getContentFromMsg } from "../Common/Functions";
import { MessageType } from "../Constant/MessageType";
 
export class Client {
    name: string;
    prefix: Array<string> | string | RegExp;
    readIncommingMsg?: boolean;
    authDir?: string;
    printQRInTerminal?: boolean;
    state?: AuthenticationState;
    saveCreds?: () => Promise<void>;
    core?: any;
    ev: EventEmitter;
    cmd?: Collection<CommandOptions | number, any>;
    cooldown?: Collection<unknown, unknown>;
    readyAt?: number;
    hearsMap: Collection<number, any>;
    qrTimeout?: number;
    markOnlineOnConnect?: boolean;

    constructor(opts: ClientOptions) {   
        this.name = opts.name;
        this.prefix = opts.prefix;
        this.readIncommingMsg = opts.readIncommingMsg ?? false;
        this.authDir = opts.authDir ?? './state';
        this.printQRInTerminal = opts.printQRInTerminal ?? true;
        this.qrTimeout = opts.qrTimeout ?? 60000
        this.markOnlineOnConnect = opts.markOnlineOnConnect ?? true;

        this.ev = new EventEmitter();
        this.cmd = new Collection();
        this.cooldown = new Collection();
        this.hearsMap = new Collection();

        if(typeof this.prefix === "string") this.prefix = this.prefix.split('');
    }

    async WAVersion(): Promise<[number, number, number]> {
        let version = [2, 2353, 56];
        try {
            let { body } = await request("https://web.whatsapp.com/check-update?version=1&platform=web");
            const data = await body.json();
            version = data.currentVersion.split(".").map(Number);
        } catch {
            version = version;
        }

        return <[number, number, number]>version;
    }

    onConnectionUpdate() {
        this.core.ev.on('connection.update', (update: { connection: any; lastDisconnect: any; qr?: string  }) => {
            const { connection, lastDisconnect } = update;
            
            if(update.qr) this.ev.emit(Events.QR, update.qr);

            if(connection === 'close') {
                const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
                console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
                if(shouldReconnect) this.launch();
            } else if(connection === 'open') {
                this.readyAt = Date.now();
                this.ev?.emit(Events.ClientReady, this.core);
            }
        });
    }

    onCredsUpdate() {
        this.core.ev.on("creds.update", this.saveCreds);
    }

    read(m: any) {
        this.core.readMessages([
            {
              remoteJid: m.key.remoteJid,
              id: m.key.id,
              participant: m.key.participant
            },
        ]);
    }

    onMessage() {
        this.core.ev.on("messages.upsert", async (m: any) => {
            let msgType = getContentType(m.messages[0].message);
            let text = getContentFromMsg(m.messages[0]);

            m.content = null;
            if(text?.length) m.content = text;

            m.messageType = msgType;
            m = { ...m, ...m.messages[0] }

            delete m.messages;
            let self = { ...this, getContentType, m };

            if(msgType === MessageType.pollCreationMessage) {
                m.content = m.message.pollCreationMessage.name;
                m.pollValues = m.message.pollCreationMessage.options.map((x: any) => x.optionName);
                m.pollSingleSelect = Boolean(m.message.pollCreationMessage.selectableOptionsCount);
                this.ev?.emit(Events.Poll, m, new Ctx({ used: { poll: m.content }, args: [], self, client: this.core }));
            }

            if(msgType === MessageType.pollUpdateMessage) {
                this.ev?.emit(Events.PollVote, m, new Ctx({ used: { pollVote: m.content }, args: [], self, client: this.core }));
            }
            
            this.ev?.emit(Events.MessagesUpsert, m, new Ctx({ used: { upsert: m.content }, args: [], self, client: this.core }));
            if (this.readIncommingMsg) this.read(m);
            await require('../Handler/Commands')(self);
        });
    }

    onGroupParticipantsUpdate() {
        this.core.ev.on("group-participants.update", async (m: { action: string; }) => {
            if (m.action === "add") return this.ev.emit(Events.UserJoin, m);
            if (m.action === "remove") return this.ev.emit(Events.UserLeave, m);
        });
    }

    onGroupsJoin() {
        this.core.ev.on('groups.upsert', (m: any) => {
            this.ev.emit(Events.GroupsJoin, m)
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
    command(opts: CommandOptions | string, code?: (ctx: Ctx) => Promise<any>) {
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

    async launch() {
        const { state, saveCreds } = await useMultiFileAuthState(this.authDir as string);
        this.state = state;
        this.saveCreds = saveCreds;

        const version = await this.WAVersion();
        this.core = makeWASocket({
            logger: pino({ level: "fatal" }),
            printQRInTerminal: this.printQRInTerminal,
            auth: this.state,
            browser: [this.name, "Chrome", "1.0.0"],
            version,
            qrTimeout: this.qrTimeout,
            markOnlineOnConnect: this.markOnlineOnConnect
        });

        this.onConnectionUpdate();
        this.onCredsUpdate();
        this.onMessage();
        this.onGroupParticipantsUpdate();
        this.onGroupsJoin();
    }
}