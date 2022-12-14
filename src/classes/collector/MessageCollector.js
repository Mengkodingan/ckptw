const { getContentFromMsg, getSender } = require("../../models/functions");
const Collector = require("./collector");

module.exports = class MessageCollector extends Collector {
    constructor(clientReq, options = {}) {
        super(options);
        this.clientReq = clientReq;
        this.jid = this.clientReq.msg.key.remoteJid;
        this.received = 0;
        this.clientReq.self.ev.on("messages", this.collect);
        this.once('end', () => {
            this.removeListener('messages', this.collect)
        });

        return this;
    }

    _collect(msg) {
        let m = msg.messages[0];
        let content = getContentFromMsg(m);
        if(!m.key.fromMe && this.jid === m.key.remoteJid && content.length) {
            this.received++;
            return {
              ...m,
              jid: m.key.remoteJid,
              sender: getSender(m, this.clientReq.self.whats),
              content,
            };
        } else {
            return null;
        }
    }
}