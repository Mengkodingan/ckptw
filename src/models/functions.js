const searched = [];
const axios = require("axios");
const { jidDecode, default: makeWASocket } = require("@adiwajshing/baileys");
const { default: pino } = require("pino");

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