import { ButtonBuilder, Client, Cooldown, SectionsBuilder, TemplateButtonsBuilder, Events, MessageType } from "../lib";
import fs from "node:fs";
import util from "util";

const bot = new Client({
    prefix: "!",
    readIncommingMsg: true,
});

bot.ev.once(Events.ClientReady, (m) => {
    console.log(`ready at ${m.user.id}`);
});

bot.ev.on(Events.Poll, (m) => {
  console.log(`POLL`, m);
});

bot.ev.on(Events.PollVote, (m) => {
  console.log(`POLL VOTE`, m);
});

bot.ev.on(Events.Reactions, (m) => {
  console.log(`REACT`, m);
});

bot.command('ping', async(ctx) => ctx.reply({ text: 'pong!' }));
bot.command('hi', async(ctx) => ctx.reply('hello! you can use string as a first parameter in reply function too!'));

bot.hears('test', async(ctx) => ctx.reply('test 1 2 3 beep boop...'));

bot.hears(MessageType.stickerMessage, async(ctx) => ctx.reply('wow, cool sticker'));
bot.hears(['help', 'menu'], async(ctx) => ctx.reply('hears can be use with array too!'));
bot.hears(/(using\s?)?regex/, async(ctx) => ctx.reply('or using regex!'));

bot.command('simulatetyping', async(ctx) => {
    ctx.simulateTyping();
    ctx.reply("aaa")
});

bot.command('collector', async(ctx) => {
  let col = ctx.MessageCollector({ time: 10000 }); // in milliseconds
  ctx.reply({ text: "say something... Timeout: 10s" });

  col.on("collect", (m) => {
      console.log("COLLECTED", m); // m is an Collections
      ctx.sendMessage(ctx.id!, {
          text: `Collected: ${m.content}\nFrom: ${m.sender}`,
      });
  });

  col.on("end", (collector, r) => {
      console.log("ended", r); // r = reason
      ctx.sendMessage(ctx.id!, { text: `Collector ended` });
  });
})

bot.command('cooldown', async(ctx) => {
  const cd = new Cooldown(ctx, 8000); // add this
  if(cd.onCooldown) return ctx.reply(`slow down... wait ${cd.timeleft}ms`); // if user has cooldown stop the code by return something.

  ctx.reply('pong!')
})

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

