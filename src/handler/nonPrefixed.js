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
    const args = d.dy.slice(theCmd.name.length).split(" ");
    theCmd.code(ctx({ args, self, msg }))
  }
};
