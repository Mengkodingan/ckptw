const Ctx = require("../classes/ctx");

module.exports = async (self) => {
  let { whats: client, CMD: cmd, PREFIX: prefix, m } = self;
  const { array_move, getContentFromMsg } = require("../models/functions");

  var msg = m.messages[0];
  var fromMe = msg.key.fromMe;
  if (!m || !msg.message) return;
  if (msg.key && msg.key.remoteJid === "status@broadcast") return;
  var dy = getContentFromMsg(msg);

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

  let hasCooldown = valArr.find(u => u.name === command && u.cooldown);
  if(hasCooldown) return require('./cooldown')({ self, args, cmd: hasCooldown, used: { prefix: startsP, command } });

  const val = valArr.find(
    (c) =>
      c.name.toLowerCase() === command.toLowerCase() ||
      (c.aliases && typeof c.aliases === "object"
        ? c.aliases.includes(command.toLowerCase())
        : c.aliases === command.toLowerCase())
  );

  if (val) {
    fromMe
      ? ""
      : val.code(new Ctx({ self, args, used: { prefix: startsP, command } }));
  }
};
