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

  get baileys() {
    return require("@adiwajshing/baileys");
  }

  async sendMessage(jid, content, options = {}) {
    this._client.sendMessage(jid, content, options);
  }

  async reply(content, options = {}) {
    this._client.sendMessage(this.id, content, { quoted: this._msg, ...options });
  }

  async replyWithJid(jid, content, options = {}) {
    this._client.sendMessage(jid, content, { quoted: this._msg, ...options });
  }

  async react(jid, emoji, key) {
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

  async sendPresenceUpdate(presence, id) {
    this._client.sendPresenceUpdate(presence, id);
  }

  async updateProfileStatus(args) {
    this._client.updateProfileStatus(args);
  }

  async updateProfileName(args) {
    this._client.updateProfileName(args);
  }

  async profilePictureUrl(jid, hd = "image") {
    return this._client.profilePictureUrl(jid, hd);
  }

  async updateProfilePicture(jid, opts = {}) {
    this._client.updateProfilePicture(jid, opts);
  }

  async block(jid) {
    this._client.updateBlockStatus(jid, "block");
  }

  async unBlock(jid) {
    this._client.updateBlockStatus(jid, "unblock");
  }

  async getBusinessProfile(jid) {
    return this._client.getBusinessProfile(jid);
  }
};
