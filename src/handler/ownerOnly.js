const Ctx = require("../classes/Ctx");
const { decodeJid, getSender } = require("../Models/functions");

module.exports = async (d) => {
  let { code, $ } = d.cmd;
  let msg = d.self.m.messages[0];
  let ownerNumbers = d.self.owners;
  let sender = decodeJid(getSender(msg, d.self.whats));

  if (ownerNumbers?.includes(sender.replace("@s.whatsapp.net", ""))) {
    code(new Ctx({ self: d.self, args: d.args, used: d.used }));
  } else {
    $ ? $(new Ctx({ self: d.self, args: d.args, used: d.used })) : '';
  }
};
