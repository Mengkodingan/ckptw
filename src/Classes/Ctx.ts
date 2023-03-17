import { Collection } from "@discordjs/collection";
import { getSender } from "../Common/Functions";
import { CollectorArgs, CtxInterface } from "../Common/Types";
import MessageCollector from "./Collector/MessageCollector";

export class Ctx implements CtxInterface {
    _used: { prefix: string | string[]; command: string; };
    _args: string[];
    _self: any;
    _client: any;
    _msg: any;
    _sender: { jid: string; pushName: string; };
    _config: { name: string; prefix: string | String[]; cmd: Collection<unknown, unknown>; };
    
    constructor(options = {
        used: {},
        args: [''],
        self: {},
        client: undefined,
    }) {
        this._used = options.used as { prefix: Array<string>|string, command: string };
        this._args = options.args;
        this._self = options.self;
        this._client = options.client;
        this._msg = this._self.m.messages[0];
        this._sender = {
            jid: getSender(this._msg, this._client),
            pushName: this._msg.pushName,
        };

        this._config = {
            name: this._self.name,
            prefix: this._self.prefix,
            cmd: this._self.cmd,
        };
    }

    get id(): string {
        return this._msg.key.remoteJid;
    }

    get args(): Array<string> {
        return this._args;
    }

    get msg() {
        return this._msg;
    }

    get sender(): { jid: string, pushName: string } {
        return this._sender;
    }

    async sendMessage(jid: string, content: object, options = {}): Promise<void> {
        this._client.sendMessage(jid, content, options);
    }

    async reply(content: object, options = {}): Promise<void> {
        this._client.sendMessage(this.id, content, {
          quoted: this._msg,
          ...options,
        });
    }
    
    async replyWithJid(jid: string, content: object, options = {}): Promise<void> {
        this._client.sendMessage(jid, content, { quoted: this._msg, ...options });
    }
    
    async react(jid: string, emoji: string, key?: object) {
        this._client.sendMessage(jid, {
          react: { text: emoji, key: key ? key : this._msg.key },
        });
    }

    MessageCollector(args: CollectorArgs = {}) {
        return new MessageCollector({ self: this._self, msg: this._msg }, args);
    }

    awaitMessages(args: CollectorArgs = {}) {
        return new Promise((resolve, reject) => {
            const col = this.MessageCollector(args);
            col.once("end", (collected, r) => {
                if (args.endReason?.includes(r)) {
                    reject(collected);
                } else {
                    resolve(collected);
                }
            });
        });
    }
}