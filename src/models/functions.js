const axios = require("axios");
const { jidDecode, default: makeWASocket, getContentType } = require("@adiwajshing/baileys");
const { default: pino } = require("pino");
let fs = require('fs');
let path = require('path');

exports.makeSocket = (t) => {
  return makeWASocket({
    logger: pino({ level: "fatal" }),
    printQRInTerminal: t.printQRInTerminal,
    auth: t.state,
    browser: [t.NAME, "Chrome", "1.0.0"],
    version: module.exports.getWaWebVer()
  })
};

exports.getWaWebVer = () => {
  let version;
  try {
    let { data } = axios.get("https://web.whatsapp.com/check-update?version=1&platform=web");
    version = [data.currentVersion.replace(/[.]/g, ", ")]
  } catch {
    version = [2, 2245, 9];
  }
  return version;
};

exports.decodeJid = (jid) => {
  if (!jid) return jid;
  if (/:\d+@/gi.test(jid)) {
    let decode = jidDecode(jid) || {};
    return (
      (decode.user && decode.server && decode.user + "@" + decode.server) || jid
    );
  } else return jid;
};

exports.sender = (d) => {
  return d.msg.key.fromMe
    ? d.client.user.id
    : d.msg.participant
    ? d.msg.participant
    : d.msg.key.participant
    ? d.msg.key.participant
    : d.msg.key.remoteJid;
};

exports.array_move = (arr, old_index, new_index) => {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
};

exports.checkConnect = (con, self, callback) => {
  var test = setInterval(function () {
    if (self.connect) {
      con = self.connect;
      clearInterval(test);
      callback(con);
    }
  }, 1000);
};

exports.checkQR = (con, self, callback) => {
  if (!self.connect) {
    var checkQr = setInterval(function () {
      if (self.qr) {
        con = self.qr;
        clearInterval(checkQr);
        callback(con);
      }
    }, 1000);
  }
};

exports.walk = (dir, callback) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    var filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      module.exports.walk(filepath, callback);
    } else if (stats.isFile()) {
      callback(filepath, stats);
    }
  });
}

exports.getContentFromMsg = (msg) => {
  let type = getContentType(msg.message);
  return type === "conversation" && msg.message.conversation
      ? msg.message.conversation
      : type == "imageMessage" && msg.message.imageMessage.caption
      ? msg.message.imageMessage.caption
      : type == "documentMessage" && msg.message.documentMessage.caption
      ? msg.message.documentMessage.caption
      : type == "videoMessage" && msg.message.videoMessage.caption
      ? msg.message.videoMessage.caption
      : type == "extendedTextMessage" && msg.message.extendedTextMessage.text
      ? msg.message.extendedTextMessage.text
      : type == "listResponseMessage"
      ? msg.message.listResponseMessage.singleSelectReply.selectedRowId
      : type == "buttonsResponseMessage" &&
        msg.message.buttonsResponseMessage.selectedButtonId
      ? msg.message.buttonsResponseMessage.selectedButtonId
      : type == "templateButtonReplyMessage" &&
        msg.message.templateButtonReplyMessage.selectedId
      ? msg.message.templateButtonReplyMessage.selectedId
      : "";
}

exports.getSender = (msg, client) => {
      return msg.key.fromMe
        ? client.user.id
        : msg.participant
        ? msg.participant
        : msg.key.participant
        ? msg.key.participant
        : msg.key.remoteJid;
    }