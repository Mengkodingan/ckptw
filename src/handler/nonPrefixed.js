const { ctx } = require("../models/ctx");

module.exports = async (d) => {
  const cmds = Array.from(d.valArr.filter((c) => c.nonPrefixed));
  if (!cmds.length) return;

  const cmd = cmds.filter((c) => d.dy.startsWith(c.name));
  cmd.push(
    ...cmds.filter(
      (c) =>
        c.aliases && c.aliases.some((a) => d.dy.startsWith(a.toLowerCase()))
    )
  );

  if (!cmd.length) return;
  for (const theCmd of cmd) {
    let args = d.dy.trim().split(/ +/g);
    let command = args.shift().toLowerCase();
    theCmd.code(ctx({ args, self: d.self, msg: d.msg, used: { prefix: "", command } }))
  }
};
