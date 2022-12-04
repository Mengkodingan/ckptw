const { jidDecode } = require("@adiwajshing/baileys");
const { getSender } = require("../models/functions");
const MessageCollector = require("./collector/MessageCollector");

module.exports = class Ctx {
  constructor(options = {}) {
    this._used = options.used;
    this._args = options.args;
    this._self = options.self;
    this._client = options.self.whats;
    this._msg = this._self.m.messages[0];
    this._sender = {
      jid: getSender(this._msg, this._client),
      pushName: this._msg.pushName,
    };
    this._config = {
      name: this._self.NAME,
      prefix: this._self.PREFIX,
      cmd: this._self.CMD,
    };
  }

  get id() {
    return this._msg.key.remoteJid;
  }

  get used() {
    return this._used;
  }

  get args() {
    return this._args;
  }

  get msg() {
    return this._msg;
  }

  get config() {
    return this._config;
  }

  get sender() {
    return this._sender;
  }

  get senderJid() {
    return this._sender.jid;
  }

  get pushName() {
    return this._sender.pushName;
  }

  async sendMessage(jid, content, options = {}) {
    this._client.sendMessage(jid, content, options);
  }

  async reply(jid, content, options = { quoted: this._msg }) {
    this._client.sendMessage(jid, content, options);
  }

  react(jid, emoji, key) {
    this._client.sendMessage(jid, {
      react: { text: emoji, key: key ? key : this._msg.key },
    });
  }

  MessageCollector(args = {}) {
    return new MessageCollector({ self: this._self, msg: this._msg }, args);
  }

  awaitMessages(args = {}) {
    return new Promise((resolve, reject) => {
      const col = this.MessageCollector(args);
      col.once("end", (collected, r) => {
        if (args.endReason?.includes(r)) {
          reject(collected);
        } else {
          resolve(collected);
        }
      });
    });
  }

  decodeJid(jid) {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (
        (decode.user && decode.server && decode.user + "@" + decode.server) ||
        jid
      );
    } else return jid;
  }
};
