import { Collection } from "@discordjs/collection";
import { Ctx } from "../Classes/Ctx";

export interface ClientOptions {
    name: string;
    prefix: Array<string>|string;
    readIncommingMsg?: boolean;
    authDir?: string;
    printQRInTerminal?: boolean;
    qrTimeout?: number;
    markOnlineOnConnect?: boolean;
}

export interface CommandOptions {
    name: string;
    aliases?: Array<string>;
    code: (ctx: Ctx) => Promise<any>;
}

export interface SectionsOptions {
    title: string;
    rows: SectionsRows[];
}

export interface SectionsRows {
    title: string,
    rowId: number,
    description?: string
}

export interface CollectorArgs {
    time?: number;
    max?: number;
    endReason?: string[];
    maxProcessed?: number;
    filter?: () => boolean;
}

export interface CtxInterface {
    _used: { prefix: Array<string>|string, command: string };
    _args: Array<String>;
    _self: any;
    _client: any;
    _msg: any;
    _sender: { jid: string; pushName: string; };
    _config: { name: string; prefix: string|Array<String>; cmd: Collection<unknown, unknown>; };
}