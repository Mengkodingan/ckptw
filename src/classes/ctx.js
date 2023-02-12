const {
  jidDecode,
  downloadContentFromMessage,
} = require("@adiwajshing/baileys");
const fs = require("fs");
const { getSender } = require("../Models/functions");
const MessageCollector = require("./Collector/MessageCollector");
const Group = require("./Group");

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
    this._cooldownRemaining = options.cooldownRemaining ?? 0;
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

  get isCooldown() {
    return this._cooldownRemaining ? true : false;
  }

  get cooldownRemaining() {
    return this._cooldownRemaining;
  }

  async onCooldownTimeout(callback) {
    setTimeout(callback, this.cooldownRemaining);
  }

  async isImage() {
    const type = this.baileys.getContentType(this._msg.message);
    return type == "imageMessage";
  }

  async isVideo() {
    const type = this.baileys.getContentType(this._msg.message);
    return type == "videoMessage";
  }

  async isQuotedImage() {
    if (this.baileys.getContentType(this._msg.message) == "conversation")
      return false;
    const content = JSON.stringify(
      this._msg.message.extendedTextMessage.contextInfo.quotedMessage
    );
    return content.includes("imageMessage");
  }

  async isQuotedVideo() {
    if (this.baileys.getContentType(this._msg.message) == "conversation")
      return false;
    const content = JSON.stringify(
      this._msg.message.extendedTextMessage.contextInfo.quotedMessage
    );
    return content.includes("videoMessage");
  }

  async isQuotedSticker() {
    if (this.baileys.getContentType(this._msg.message) == "conversation")
      return false;
    const content = JSON.stringify(
      this._msg.message.extendedTextMessage.contextInfo.quotedMessage
    );
    return content.includes("stickerMessage");
  }

  async sendMessage(jid, content, options = {}) {
    this._client.sendMessage(jid, content, options);
  }

  async sendAudio(jid, url, vn, options = {}) {
    this._client.sendMessage(
      jid,
      { audio: { url: url }, mimetype: "audio/mp4", ptt: vn || false },
      options
    );
  }

  async sendImage(jid, url, caption, options = {}) {
    this._client.sendMessage(
      jid,
      { image: { url: url }, caption: caption },
      options
    );
  }

  async sendVideo(jid, url, caption, options = {}) {
    this._client.sendMessage(
      jid,
      { video: { url: url }, caption: caption },
      options
    );
  }

  async sendGif(jid, url, caption, options = {}) {
    this._client.sendMessage(
      jid,
      { video: { url: url }, caption: caption, gifPlayback: true },
      options
    );
  }

  async reply(content, options = {}) {
    this._client.sendMessage(this.id, content, {
      quoted: this._msg,
      ...options,
    });
  }

  async replyWithJid(jid, content, options = {}) {
    this._client.sendMessage(jid, content, { quoted: this._msg, ...options });
  }

  async react(jid, emoji, key) {
    this._client.sendMessage(jid, {
      react: { text: emoji, key: key ? key : this._msg.key },
    });
  }

  async getImage(name) {
    const path = await `./${name || Math.floor(Math.random() * 10000)}.png`;
    const stream = await downloadContentFromMessage(
      this._msg.message.imageMessage ||
        this._msg.message.extendedTextMessage?.contextInfo.quotedMessage
          .imageMessage,
      "image"
    );

    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    await fs.writeFileSync(path, buffer);
    return path;
  }

  async getVideo(name) {
    const path = await `./${name || Math.floor(Math.random() * 10000)}.mp4`;
    const stream = await downloadContentFromMessage(
      this._msg.message.videoMessage ||
        this._msg.message.extendedTextMessage?.contextInfo.quotedMessage
          .videoMessage,
      "video"
    );

    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    await fs.writeFileSync(path, buffer);
    return path;
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

  isOwner(jid = this._sender.jid) {
    return this._self.owners.includes(jid.replace("@s.whatsapp.net", ""));
  }

  isGroup(jid = this.id) {
    return jid.endsWith("@g.us");
  }

  async onWhatsapp(jid = this._sender.jid) {
    let [result] = await this._client.onWhatsApp(jid);
    return result;
  }

  async fetchStatus(jid = this._sender.jid) {
    return this._client.fetchStatus(jid);
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

  get group() {
    return new Group(this);
  }
};
