import makeWASocket, {
  DisconnectReason,
  getContentType,
  useMultiFileAuthState,
} from "@adiwajshing/baileys";
import { AuthenticationState } from "@adiwajshing/baileys/lib/Types";

import { Boom } from "@hapi/boom";
import pino from "pino";
import { request } from "undici";
import EventEmitter from "events";
import { Events } from "../Constant/Events";
import { Collection } from "@discordjs/collection";
import { CommandOptions } from "../Common/Types";
 
export class Client {
    name: string;
    prefix: Array<string>|string;
    readIncommingMsg?: boolean;
    authDir?: string;
    printQRInTerminal?: boolean;
    state?: AuthenticationState;
    saveCreds?: () => Promise<void>;
    whats?: any;
    ev: EventEmitter;
    cmd?: Collection<unknown, unknown>;
    readyAt?: number;

    constructor({
        name = '',
        prefix = '',
        readIncommingMsg = false,
        authDir = './state',
        printQRInTerminal = true
    }) {        
        this.name = name;
        this.prefix = prefix;
        this.readIncommingMsg = readIncommingMsg;
        this.authDir = authDir;
        this.printQRInTerminal = printQRInTerminal;

        this.ev = new EventEmitter();
        this.cmd = new Collection();

        if(typeof this.prefix === "string") this.prefix = this.prefix.split('');
    }

    async WAVersion(): Promise<[number, number, number]> {
        let version = [2, 2311, 5];
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
        this.whats.ev.on('connection.update', (update: { connection: any; lastDisconnect: any; qr?: string  }) => {
            const { connection, lastDisconnect } = update;
            
            if(update.qr) this.ev.emit(Events.QR, update.qr);

            if(connection === 'close') {
                const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
                console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
                if(shouldReconnect) this.launch();
            } else if(connection === 'open') {
                this.readyAt = Date.now();
                this.ev?.emit(Events.ClientReady, this.whats);
            }
        });
    }

    onCredsUpdate() {
        this.whats.ev.on("creds.update", this.saveCreds);
    }

    read(m: { messages: { key: any; }[]; }) {
        this.whats.readMessages([
            {
              remoteJid: m.messages[0].key.remoteJid,
              id: m.messages[0].key.id,
              participant: m.messages[0].key.participant
            },
        ]);
    }

    onMessage() {
        this.whats.ev.on("messages.upsert", async (m: any) => {
          this.ev?.emit(Events.MessagesUpsert, m);
          let self = { ...this, getContentType, m };
    
          if (this.readIncommingMsg) this.read(m);
          await require('../Handler/Commands')(self);
        });
    }

    onGroupParticipantsUpdate() {
        this.whats.ev.on("group-participants.update", async (m: { action: string; }) => {
            if (m.action === "add") return this.ev.emit(Events.UserJoin, m);
            if (m.action === "remove") return this.ev.emit(Events.UserLeave, m);
        });
    }

    onGroupsJoin() {
        this.whats.ev.on('groups.upsert', (m: any) => {
            this.ev.emit(Events.GroupsJoin, m)
        });
    }

    command(opts: CommandOptions) {
        this.cmd?.set(opts.name, opts);
    }

    async launch() {
        const { state, saveCreds } = await useMultiFileAuthState(this.authDir as string);
        this.state = state;
        this.saveCreds = saveCreds;

        const version = await this.WAVersion();
        this.whats = makeWASocket({
            logger: pino({ level: "fatal" }),
            printQRInTerminal: this.printQRInTerminal,
            auth: this.state,
            browser: [this.name, "Chrome", "1.0.0"],
            version,
        });

        this.onConnectionUpdate();
        this.onCredsUpdate();
        this.onMessage();
        this.onGroupParticipantsUpdate();
        this.onGroupsJoin();
    }
}