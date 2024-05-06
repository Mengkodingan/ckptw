import { Client, Events } from "../lib";
import util from "util";

const bot = new Client({
  prefix: "!",
  readIncommingMsg: true
});

bot.ev.once(Events.ClientReady, (m) => {
  console.log(`ready at ${m.user.id}`);
});

bot.command({
  name: "ping",
  aliases: ["pong"],
  code: async (ctx) => {
    ctx.sendMessage(ctx.id!, { text: "pong!" });
  },
});

bot.command({
  name: "say",
  aliases: ["echo"],
  code: async (ctx) => {
    ctx.reply({ text: ctx.args.join(" ") })
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

