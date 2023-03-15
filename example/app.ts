import { Client, Events } from "../dist";
import util from "util";

const bot = new Client({
  name: "something",
  prefix: "!",
  readIncommingMsg: true
});

bot.ev.once(Events.ClientReady, (m) => {
  console.log(`ready at ${m.user.id}`);
});

bot.command({
  name: "ping",
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
