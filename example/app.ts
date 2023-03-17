import { Client, Cooldown } from "../dist";
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

bot.command({
  name: "ping",
  aliases: ["pong"],
  code: async (ctx) => {
    const cd = new Cooldown(ctx, 8000);
    if(cd.onCooldown) return ctx.reply({ text: `slow down... wait ${cd.timeleft}ms` });
    
    cd.on("end", () => {
      ctx.reply({ text: "cd timeout" });
    });

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

