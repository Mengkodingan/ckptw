import { Collection } from "@discordjs/collection";
import { getSender } from "../Common/Functions";
import { ICollectorArgs, ICollectorOptions, ICommandOptions, ICtx, ICtxOptions, ICtxSelf, IMessageInfo } from "../Common/Types";
import makeWASocket, { AnyMessageContent, MiscMessageGenerationOptions, PollMessageOptions, downloadMediaMessage } from "@whiskeysockets/baileys";
import { WAProto } from "@whiskeysockets/baileys"
import { MessageCollector } from "./Collector/MessageCollector";

export class Ctx implements ICtx {
    _used: { prefix: string | string[]; command: string; };
    _args: string[];
    _self: ICtxSelf;
    _client: ReturnType<typeof makeWASocket>;
    _msg: IMessageInfo;
    _sender: { jid: string | null | undefined; pushName: string | null | undefined; };
    _config: { name: string | RegExp | string[]; prefix: string | RegExp | string[]; cmd: Collection<number | ICommandOptions, any> | undefined; };
    
    constructor(options: ICtxOptions) {
        this._used = options.used as { prefix: Array<string>|string, command: string };
        this._args = options.args;
        this._self = options.self as ICtxSelf;
        this._client = options.client;
        this._msg = this._self.m;
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

    get id(): string | null | undefined {
        return this._msg.key.remoteJid;
    }

    get args(): Array<string> {
        return this._args;
    }

    get msg(): IMessageInfo {
        return this._msg;
    }

    get sender(): { jid: string | null | undefined, pushName: string | null | undefined } {
        return this._sender;
    }

    async sendMessage(jid: string, content: AnyMessageContent, options: MiscMessageGenerationOptions = {}): Promise<undefined | WAProto.WebMessageInfo> {
        return this._client.sendMessage(jid, content, options);
    }

    async reply(content: AnyMessageContent | string, options: MiscMessageGenerationOptions = {}): Promise<undefined | WAProto.WebMessageInfo> {
        if(typeof content === 'string') content = { text: content }
        return this._client.sendMessage(this.id as string, content, {
          quoted: this._msg,
          ...options,
        });
    }
    
    async replyWithJid(jid: string, content: AnyMessageContent, options: MiscMessageGenerationOptions = {}): Promise<undefined | WAProto.WebMessageInfo> {
        return this._client.sendMessage(jid, content, { quoted: this._msg, ...options });
    }
    
    async react(jid: string, emoji: string, key?: WAProto.IMessageKey): Promise<undefined | WAProto.WebMessageInfo> {
        return this._client.sendMessage(jid, {
          react: { text: emoji, key: key ? key : this._msg.key },
        });
    }

    MessageCollector(args: ICollectorOptions = {
        filter: function (args: any, collector: Collection<any, any>): boolean {
            throw new Error("Function not implemented.");
        },
        time: 0,
        max: 0,
        maxProcessed: 0
    }) {
        return new MessageCollector({ self: this._self, msg: this._msg }, args);
    }

    awaitMessages(args: ICollectorOptions = {
        filter: function (args: any, collector: Collection<any, any>): boolean {
            throw new Error("Function not implemented.");
        },
        time: 0,
        max: 0,
        maxProcessed: 0
    }) {
        return new Promise((resolve, reject) => {
            const col = this.MessageCollector(args);
            col.once("end", (collected: Collection<string, any>, r: any) => {
                if (args.endReason?.includes(r)) {
                    reject(collected);
                } else {
                    resolve(collected);
                }
            });
        });
    }

    getMessageType(): keyof WAProto.IMessage | undefined {
        return this._msg.messageType
    }

    async getMediaMessage(msg: IMessageInfo, type: 'buffer' | 'stream'): Promise<Buffer | import('stream').Transform> {
        let buffer = await downloadMediaMessage(msg, type, {}, { logger: this._self.logger as any, reuploadRequest: this._client.updateMediaMessage });
        return buffer;
    }

    read(): void {
        let m = this._msg;
        this._client.readMessages([
            {
              remoteJid: m.key.remoteJid,
              id: m.key.id,
              participant: m.key.participant
            },
        ]);
    }

    simulateTyping(): void {
        this._client.sendPresenceUpdate('composing', this.id as string)
    }

    async deleteMessage(key: WAProto.IMessageKey): Promise<undefined | WAProto.WebMessageInfo> {
        return this._client.sendMessage(this.id as string, { delete: key });
    }

    simulateRecording(): void {
        this._client.sendPresenceUpdate('recording', this.id as string);
    }

    async editMessage(key: WAProto.IMessageKey, newText: string) {
        await this._client.relayMessage(this.id as string, {
            protocolMessage: {
              key,
              type: 14,
              editedMessage: {
                conversation: newText
              }
            }
        }, {})
    }

    async sendPoll(jid: string, args: { name: string, values: Array<string>, singleSelect: boolean, selectableCount?: boolean }): Promise<undefined | WAProto.WebMessageInfo> {
        args.selectableCount = args.singleSelect ? true : false;
        return this._client.sendMessage(jid, { poll: args as PollMessageOptions })
    }

    getMentioned(): string[] | null | undefined {
        return this._msg.message?.extendedTextMessage ? this._msg.message.extendedTextMessage.contextInfo?.mentionedJid : [];
    }
}