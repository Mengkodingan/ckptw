import { Client } from "../dist";
import { Events } from "../dist/Constant";
import util from "util";

const bot = new Client({
  name: "something",
  prefix: "!",
  readIncommingMsg: true
});

bot.ev.once(Events.ClientReady, (m) => {
  console.log(`ready at ${m.user.id}`);
});

bot.ev.on(Events.GroupsJoin, (m) => {
  console.log("GJOIN", m);
});

bot.ev.on(Events.UserJoin, (m) => {
  console.log("UJ", m);
});

bot.ev.on(Events.UserLeave, (m) => {
  console.log("UL", m);
});

bot.command({
  name: "ping",
  aliases: ["pong"],
  code: async (ctx) => {
    ctx.sendMessage(ctx.id, { text: "pong!" });
  },
});

bot.command({
  name: "e",
  code: async (ctx) => {
    try {
      var evaled = await eval(ctx.args.join(" "));
      return ctx.reply({
        text: util.inspect(evaled, { depth: 0 }),
      });
    } catch (err) {
      return ctx.reply({ text: `${err}!` });
    }
  },
});

bot.launch();

