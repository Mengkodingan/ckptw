const { ctx } = require("../models/ctx");

module.exports = async (self) => {
  let { whats: client, CMD: cmd, PREFIX: prefix, getContentType: getType, m } = self;
  const { array_move } = require("../models/functions");

  var msg = m.messages[0];
  if (!m || !msg.message) return;
  if (msg.key && msg.key.remoteJid === "status@broadcast") return;
  const type = getType(msg.message);
  var dy =
    type === "conversation" && msg.message.conversation
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

  let args;
  let command;
  const valArr = Array.from(cmd.values());

  if (prefix[0] == "") {
    const emptyIndex = prefix.indexOf(
      prefix.filter((x) => x.includes("")).join("")
    );
    prefix = array_move(prefix, emptyIndex - 1, prefix.length - 1);
  }

  const startsP = prefix.find((p) => dy.startsWith(p));
  if (!prefix.includes(startsP)) return require('./nonPrefixed')({ valArr, dy, msg, client, cmd, self });

  args = dy.slice(startsP.length).trim().split(/ +/g);
  command = args.shift().toLowerCase();

  const val = valArr.find(
    (c) =>
      c.name.toLowerCase() === command.toLowerCase() ||
      (c.aliases && typeof c.aliases === "object"
        ? c.aliases.includes(command.toLowerCase())
        : c.aliases === command.toLowerCase())
  );

  if (val) {
    val.code(ctx({ args, self, msg, used: { prefix: startsP, command } }));
  }
};
