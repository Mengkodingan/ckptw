import { Collection } from "@discordjs/collection";
import { getSender } from "../Models/Functions";

export class Ctx {
    _used?: any;
    _args?: Array<String>;
    _self?: any;
    _client?: any;
    _msg?: any;
    _sender?: { jid: string; pushName: string; };
    _config?: { name: string; prefix: string|Array<String>; cmd: Collection<unknown, unknown>; };

    constructor(options = {
        used: {},
        args: [''],
        self: {},
        client: undefined,
    }) {
        this._used = options.used;
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

    get id() {
        return this._msg.key.remoteJid;
    }

    async sendMessage(jid: string, content: object, options = {}): Promise<void> {
        this._client.sendMessage(jid, content, options);
    }
}