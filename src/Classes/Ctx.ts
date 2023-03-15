import { Collection } from "@discordjs/collection";
import { getSender } from "../Common/Functions";

export class Ctx {
    _used: { prefix: Array<string>|string, command: string };
    _args: Array<String>;
    _self: any;
    _client: any;
    _msg: any;
    _sender: { jid: string; pushName: string; };
    _config: { name: string; prefix: string|Array<String>; cmd: Collection<unknown, unknown>; };

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

    get args(): Array<String> {
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
}