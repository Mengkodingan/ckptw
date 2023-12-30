import { Collection } from "@discordjs/collection";
import { decodeJid } from "../Common/Functions";
import { ICtx } from "../Common/Types";
import EventEmitter from "events";

export class Cooldown extends EventEmitter {
    ms: number;
    cooldown: Collection<unknown, unknown> | undefined;
    timeout: number;

    constructor(ctx: ICtx, ms: number) {
        super();
        this.ms = ms;
        this.cooldown = ctx._self.cooldown;
        this.timeout = 0;

        let q = `cooldown_${ctx._used.command}_${decodeJid(ctx._msg.key.remoteJid as string)}_${decodeJid(ctx._sender.jid as string)}`;
        const get = this.cooldown?.get(q);
        if (get) {
            this.timeout = Number(get) - Date.now();
          } else {
            this.cooldown?.set(q, Date.now() + ms);
            setTimeout(() => {
                this.cooldown?.delete(q);
                this.emit("end");
            }, ms);
          }
    }
    
    get onCooldown(): boolean {
        return this.timeout ? true : false;
    }

    get timeleft(): number {
        return this.timeout;
    }
}