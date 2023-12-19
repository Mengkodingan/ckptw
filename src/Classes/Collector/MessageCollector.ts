const { getContentFromMsg, getSender } = require("../../Common/Functions");
const { Events } = require("../../Constant/Events");
const Collector = require("./Collector");

export class MessageCollector extends Collector {
    constructor(clientReq: { self: any, msg: any}, options = {}) {
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

    _collect(msg: any) {
        let content = getContentFromMsg(msg);
        if(!msg.key.fromMe && this.jid === msg.key.remoteJid && content.length) {
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