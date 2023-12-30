import { Collection } from "@discordjs/collection";
import { Ctx } from "../Classes/Ctx";
import makeWASocket, { WAProto } from "@whiskeysockets/baileys"
import { Client } from "../Classes/Client";

export interface IClientOptions {
    name: string;
    prefix: Array<string> | string | RegExp;
    readIncommingMsg?: boolean;
    authDir?: string;
    printQRInTerminal?: boolean;
    qrTimeout?: number;
    markOnlineOnConnect?: boolean;
    logger?: any;
}

export interface ICommandOptions {
    name: string;
    aliases?: Array<string>;
    code: (ctx: Ctx) => Promise<any>;
}

export interface ISectionsOptions {
    title: string;
    rows: ISectionsRows[];
}

export interface ISectionsRows {
    title: string,
    rowId: number,
    description?: string
}

export interface ICollectorArgs {
    time?: number;
    max?: number;
    endReason?: string[];
    maxProcessed?: number;
    filter?: () => boolean;
}

export interface ICtx {
    _used: { prefix: Array<string>|string, command: string };
    _args: Array<String>;
    _self: ICtxSelf;
    _client: ReturnType<typeof makeWASocket>;
    _msg: IMessageInfo;
    _sender: { jid: string | null | undefined; pushName: string | null | undefined; };
    _config: { name: string | RegExp | string[]; prefix: string | RegExp | string[]; cmd: Collection<number | ICommandOptions, any> | undefined; };
}

export interface ICollectorOptions {
    filter: (args: any, collector: Collection<any, any>) => boolean,
    time: number,
    max: number,
    maxProcessed: number,
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
    sender: string | null | undefined,
    content: string | null | undefined
}

export interface ICtxSelf extends Client {
    getContentType: any,
    m: IMessageInfo
}

export interface ICtxOptions {
    used: any;
    args: string[];
    self: ICtxSelf;
    client: ReturnType<typeof makeWASocket>;
}