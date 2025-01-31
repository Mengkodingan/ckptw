import { Collection } from "@discordjs/collection";
import { Ctx } from "../Classes/Ctx";
import makeWASocket, { Contact, downloadContentFromMessage, getContentType, proto, WAProto } from "@whiskeysockets/baileys"
import { Client } from "../Classes/Client";

export type ButtonType = 'cta_url' | 'cta_call' | 'cta_copy' | 'cta_reminder' | 'cta_cancel_reminder' | 'address_message' | 'send_location' | 'quick_reply';

export interface IClientOptions {
    prefix: Array<string> | string | RegExp;
    readIncommingMsg?: boolean;
    authDir?: string;
    printQRInTerminal?: boolean;
    qrTimeout?: number;
    markOnlineOnConnect?: boolean;
    logger?: any;
    phoneNumber?: string;
    usePairingCode?: boolean;
    selfReply?: boolean;
    WAVersion?: [number, number, number];
    autoMention?: boolean;
    authAdapter?: Promise<any>;
}

export interface ICommandOptions {
    name: string;
    aliases?: Array<string>;
    code: (ctx: Ctx) => Promise<any>;
}

export interface ISectionsOptions {
    displayText: string;
    sections: { title: string; rows: ISectionsRows[] }[];
}

export interface ISectionsRows {
    title: string;
    id: string;
    header?: string;
    description?: string;
}

export interface ICollectorArgs {
    time?: number;
    max?: number;
    endReason?: string[];
    maxProcessed?: number;
    filter?: () => boolean;
}

export interface ICtx {
    _used: { prefix?: Array<string>|string, command?: string; upsert?: any; hears?: any; poll?: any; pollVote?: any; reactions?: any; };
    _args: Array<String>;
    _self: ICtxSelf;
    _client: ReturnType<typeof makeWASocket>;
    _msg: IMessageInfo;
    _sender: { jid: string | null | undefined; decodedJid: string | null | undefined; pushName: string | null | undefined; };
    _config: { prefix: string | RegExp | string[]; cmd: Collection<number | ICommandOptions, any> | undefined; };
}

export interface ICollectorOptions {
    filter?: (args: any, collector: Collection<any, any>) => boolean,
    time: number,
    max?: number,
    maxProcessed?: number,
    endReason?: string[]
}

export interface IMessageInfo extends WAProto.IWebMessageInfo {
    content: string | null | undefined,
    messageType: keyof WAProto.IMessage | undefined,
    pollValues?: Array<string>,
    pollSingleSelect?: boolean
}

export interface IMessageCollectorCollect extends IMessageInfo {
    jid: string | null | undefined,
    decodedJid: string | null | undefined,
    sender: string | null | undefined,
    decodedSender: string | null | undefined,
    content: string | null | undefined
}

export interface ICtxSelf extends Client {
    getContentType: typeof getContentType,
    downloadContentFromMessage: typeof downloadContentFromMessage,
    proto: typeof proto,
    m: IMessageInfo
}

export interface ICtxOptions {
    used: { prefix?: Array<string>|string, command?: string; upsert?: any; hears?: any; poll?: any; pollVote?: any; reactions?: any; };
    args: string[];
    self: ICtxSelf;
    client: ReturnType<typeof makeWASocket>;
}

export interface IInteractiveMessageContent { 
    body?: string;
    footer?: string;
    header?: (proto.Message.InteractiveMessage.IHeader|null);
    contextInfo?: (proto.IContextInfo|null);
    shopStorefrontMessage?: (proto.Message.InteractiveMessage.IShopMessage|null);
    collectionMessage?: (proto.Message.InteractiveMessage.ICollectionMessage|null);
    nativeFlowMessage?: (proto.Message.InteractiveMessage.INativeFlowMessage|null);
    carouselMessage?: (proto.Message.InteractiveMessage.ICarouselMessage|null);
}

export interface IMe extends Contact {
    decodedId: string;
    readyAt?: number;
}