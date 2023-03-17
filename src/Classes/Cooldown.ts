import { Collection } from "@discordjs/collection";
import { decodeJid } from "../Common/Functions";
import { CtxInterface } from "../Common/Types";
import EventEmitter from "events";

export class Cooldown extends EventEmitter {
    ms: number;
    cooldown: Collection<unknown, unknown>;
    timeout: number;

    constructor(ctx: CtxInterface, ms: number) {
        super();
        this.ms = ms;
        this.cooldown = ctx._self.cooldown;
        this.timeout = 0;

        let q = `cooldown_${ctx._used.command}_${decodeJid(ctx._msg.key.remoteJid)}_${decodeJid(ctx._sender.jid)}`;
        const get = this.cooldown.get(q);
        if (get) {
            this.timeout = Number(get) - Date.now();
          } else {
            this.cooldown.set(q, Date.now() + ms);
            setTimeout(() => {
                this.cooldown.delete(q);
                this.emit("end");
            }, ms);
          }
    }
    
    get onCooldown() {
        return this.timeout ? true : false;
    }

    get timeleft() {
        return this.timeout;
    }
}