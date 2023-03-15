import { Ctx } from "../Classes/Ctx";

export interface CommandOptions {
    name: string;
    aliases?: Array<string>;
    code: (ctx: Ctx) => Promise<any>
}