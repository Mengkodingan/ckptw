const baileys = require('@adiwajshing/baileys');
const { MessageCollector } = require('../..');
const { getSender } = require('./functions');
exports.ctx = ({ args, self, msg, used }) => {
  return {
    id: msg.key.remoteJid,
    used,
    args,
    ...self.whats,
    msg,
    config: {
      name: self.NAME,
      prefix: self.PREFIX,
      cmd: self.CMD,
    },
    MessageCollector: function (opts) {
      return new MessageCollector({ self, msg }, opts)
    },
    react: function (id, e, w) {
      self.whats.sendMessage(id, { react: { text: e, key: w ? w : msg.key } });
    },
    reply: function (id, obj) {
      self.whats.sendMessage(id, obj, { quoted: msg });
    },
    decodeJid: function (jid) {
      if (!jid) return jid;
      if (/:\d+@/gi.test(jid)) {
        let decode = baileys.jidDecode(jid) || {};
        return (
          (decode.user && decode.server && decode.user + "@" + decode.server) ||
          jid
        );
      } else return jid;
    },
    sender: getSender(msg, self.whats)
  };
};