const Ctx = require("../classes/ctx")
const { decodeJid, getSender } = require("../models/functions")

module.exports = async(d) => {
    let { name: cmd, cooldown: n, code } = d.cmd;
    let msg = d.self.m.messages[0];
    let decodedJid = decodeJid(msg.key.remoteJid);
    let sender = decodeJid(getSender(msg, d.self.whats));
    const cldn = d.self.cooldown;
    const cooldown = cldn.get(`cooldown_${cmd}_${decodedJid}_${sender}`);

    if (cooldown) {
      const r = cooldown - Date.now();
      code(new Ctx({ self: d.self, args: d.args, used: d.used, cooldownRemaining: r }));
    } else {
      cldn.set(
        `cooldown_${cmd}_${decodedJid}_${sender}`,
        Date.now() + n
      );

      setTimeout(
        () => cldn.delete(`cooldown_${cmd}_${decodedJid}_${sender}`),
        n
      );

      code(new Ctx({ self: d.self, args: d.args, used: d.used }));
    }
}