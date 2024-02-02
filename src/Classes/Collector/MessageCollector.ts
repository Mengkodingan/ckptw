import { Collection } from "@discordjs/collection";
import { getContentFromMsg, getSender } from "../../Common/Functions";
import { ICollectorOptions, IMessageCollectorCollect, IMessageInfo } from "../../Common/Types";
import { Events } from "../../Constant/Events";
import { Collector } from "./Collector";

export class MessageCollector extends Collector {
    constructor(clientReq: { self: any, msg: any}, options: ICollectorOptions = {
        filter: function (args: any, collector: Collection<any, any>): boolean {
            throw new Error("Function not implemented.");
        },
        time: 0,
        max: 0,
        maxProcessed: 0
    }) {
        super(options);
        this.clientReq = clientReq;
        this.jid = this.clientReq.msg.key.remoteJid;
        this.received = 0;
        this.clientReq.self.ev.on(Events.MessagesUpsert, this.collect);
        this.once('end', () => {
            this.removeListener(Events.MessagesUpsert, this.collect)
        });

        return this;
    }

    _collect(msg: IMessageInfo): IMessageCollectorCollect | null {
        let content = getContentFromMsg(msg as any);
        if(!msg.key.fromMe && this.jid === msg.key.remoteJid && content?.length) {
            this.received++;
            return {
              ...msg,
              jid: msg.key.remoteJid,
              sender: getSender(msg, this.clientReq.self.core),
              content,
            };
        } else {
            return null;
        }
    }
}