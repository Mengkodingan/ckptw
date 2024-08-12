import { Collection } from "@discordjs/collection";
import { decodeJid, getSender } from "../Common/Functions";
import { ICollectorArgs, ICollectorOptions, ICommandOptions, ICtx, ICtxOptions, ICtxSelf, IInteractiveMessageContent, IMessageInfo } from "../Common/Types";
import makeWASocket, { AnyMessageContent, DownloadableMessage, MediaDownloadOptions, MediaType, MessageGenerationOptionsFromContent, MiscMessageGenerationOptions, PollMessageOptions, downloadMediaMessage, generateWAMessageFromContent, getDevice, proto } from "@whiskeysockets/baileys";
import { WAProto } from "@whiskeysockets/baileys"
import { MessageCollector } from "./Collector/MessageCollector";
import { GroupData } from "./Group/GroupData";
import { Group } from "./Group/Group";

export class Ctx implements ICtx {
    _used: { prefix: string | string[]; command: string; };
    _args: string[];
    _self: ICtxSelf;
    _client: ReturnType<typeof makeWASocket>;
    _msg: IMessageInfo;
    _sender: { jid: string | null | undefined; decodedJid: string | null | undefined, pushName: string | null | undefined; };
    _config: { prefix: string | RegExp | string[]; cmd: Collection<number | ICommandOptions, any> | undefined; };
    
    constructor(options: ICtxOptions) {
        this._used = options.used as { prefix: Array<string>|string, command: string };
        this._args = options.args;
        this._self = options.self as ICtxSelf;
        this._client = options.client;
        this._msg = this._self.m;
        this._sender = {
            jid: getSender(this._msg, this._client),
            decodedJid: null,
            pushName: this._msg.pushName,
        };

        if(this._sender.jid) this._sender.decodedJid = decodeJid(this._sender.jid as string);

        this._config = {
            prefix: this._self.prefix,
            cmd: this._self.cmd,
        };
    }

    get id(): string | null | undefined {
        return this._msg.key.remoteJid;
    }

    get decodedId(): string | null | undefined {
        if(this._msg.key.remoteJid) return decodeJid(this._msg.key.remoteJid);
    }

    get args(): Array<string> {
        return this._args;
    }

    get msg(): IMessageInfo {
        return this._msg;
    }

    get sender(): { jid: string | null | undefined, decodedJid: string | null | undefined, pushName: string | null | undefined } {
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
        return await this._client.sendMessage(this.id as string, {
            text: newText,
            edit: key,
        });
    }

    async sendPoll(jid: string, args: { name: string, values: Array<string>, singleSelect: boolean, selectableCount?: boolean }): Promise<undefined | WAProto.WebMessageInfo> {
        args.selectableCount = args.singleSelect ? true : false;
        return this._client.sendMessage(jid, { poll: args as PollMessageOptions })
    }

    getMentioned(): string[] | null | undefined {
        return this._msg.message?.extendedTextMessage ? this._msg.message.extendedTextMessage.contextInfo?.mentionedJid : [];
    }

    getDevice(id: string | undefined) {
        return getDevice(id? id : this._msg.key.id!);
    }

    isGroup() {
        return this.id?.endsWith("@g.us");
    }

    async block(jid?: string): Promise<void> {
        if(jid) {
            await this._client.updateBlockStatus(decodeJid(jid), "block")
        } else {
            await this._client.updateBlockStatus(decodeJid(this.id as string), "block")
        }
    }

    async unblock(jid?: string): Promise<void> {
        if(jid) {
            await this._client.updateBlockStatus(decodeJid(jid), "unblock")
        } else {
            await this._client.updateBlockStatus(decodeJid(this.id as string), "unblock")
        }
    }

    get groups() {
        return new Group(this);
    }

    group(jid?: string) {
        return new GroupData(this, jid ? jid : (this.id as string))
    }

    get quoted() {
        return this._msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    }

    getContentType(content: WAProto.IMessage | undefined) {
        return this._self.getContentType(content);
    }

    downloadContentFromMessage(downloadable: DownloadableMessage, type: MediaType, opts?: MediaDownloadOptions) {
        return this._self.downloadContentFromMessage(downloadable, type, opts);
    }

    sendInteractiveMessage(jid: string, content: IInteractiveMessageContent, options: MessageGenerationOptionsFromContent | {} = {}) {
        let contentReal: { [key: string]: any } = {};
        Object.keys(content).map((x) => {
            if(x === 'body') {
                contentReal['body'] = proto.Message.InteractiveMessage.Body.create({ text: content.body });
            } else if(x === 'footer') {
                contentReal['footer'] = proto.Message.InteractiveMessage.Footer.create({ text: content.footer });
            } else {
                let prop = proto.Message.InteractiveMessage[x.charAt(0).toUpperCase() + x.slice(1) as keyof typeof proto.Message.InteractiveMessage] as any;
                contentReal[x] = prop.create(content[x as keyof typeof content]);
            }
        });

        let msg = generateWAMessageFromContent(jid, {
            viewOnceMessage: {
              message: {
                  "messageContextInfo": {
                    "deviceListMetadata": {},
                    "deviceListMetadataVersion": 2
                  },
                  interactiveMessage: proto.Message.InteractiveMessage.create(contentReal)
              }
            }
        }, options as any)

        this._client.relayMessage(jid, msg.message as any, {
            messageId: msg.key.id as any
        });
    }

    async replyInteractiveMessage(content: IInteractiveMessageContent, options: MessageGenerationOptionsFromContent | {} = {}) {
        return this.sendInteractiveMessage(this.id!, content, {
          quoted: this._msg,
          ...options,
        });
    }
}