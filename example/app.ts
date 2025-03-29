import { ButtonBuilder, Client, Cooldown, SectionsBuilder, TemplateButtonsBuilder, Events, MessageType, CarouselBuilder, fetchLatestWaWebVersion } from "../lib";
import fs from "node:fs";
import util from "util";

const bot = new Client({
    prefix: "!",
    readIncommingMsg: true
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

bot.use(async (ctx, next) => {
  bot.consolefy?.setTag('from middleware');
  bot.consolefy?.info(`received: ${JSON.stringify(ctx.used)} | message: ${JSON.stringify(ctx.msg)}`)
  bot.consolefy?.resetTag();

  await next();
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

bot.command('editmessage', async(ctx) => {
  let msg = await ctx.reply('this message will be edited in 2 seconds');
  setTimeout(() => {
    ctx.editMessage(msg!.key, 'edited!');
  }, 2000);
})

bot.command('mybtn', async(ctx) => {
  let button = new ButtonBuilder()
      .setId('!ping')
      .setDisplayText('command Ping')
      .setType('quick_reply')
      .build();

  let button2 = new ButtonBuilder()
      .setId('id2')
      .setDisplayText('copy code')
      .setType('cta_copy')
      .setCopyCode('hello world')
      .build();

  let button3 = new ButtonBuilder()
      .setId('id3')
      .setDisplayText('@mengkodingan/ckptw')
      .setType('cta_url')
      .setURL('https://github.com/mengkodingan/ckptw')
      .setMerchantURL('https://github.com/mengkodingan')
      .build();

  // use sendInteractiveMessage if you dont want to quote the message.
  ctx.replyInteractiveMessage({ 
    body: 'this is body', 
    footer: 'this is footer', 
    nativeFlowMessage: { buttons: [button, button2, button3] } 
  })
})

bot.command('mysections', async(ctx) => {
  let section1 = new SectionsBuilder()
    .setDisplayText("Click me")
    .addSection({
      title: 'Title 1',
      rows: [
        { header: "Row Header 1", title: "Row Title 1", description: "Row Description 1", id: "Row Id 1" },
        { header: "Row Header 2", title: "Row Title 2", description: "Row Description 2", id: "Row Id 2" }
      ]
    })
    .addSection({
      title: 'This is title 2',
      rows: [
        { title: "Ping", id: "!ping" },
        { title: "Hello world", id: "hello world" },
      ]
    })
    .build();


  ctx.sendInteractiveMessage(ctx.id!, { body: 'this is body', footer: 'this is footer', nativeFlowMessage: { buttons: [section1] } })
})

bot.command('mycarousel', async(ctx) => {
  let button = new ButtonBuilder()
      .setId('!ping')
      .setDisplayText('command Ping')
      .setType('quick_reply')
      .build();

  let exampleMediaAttachment = await ctx.prepareWAMessageMedia({ image: { url:  "https://github.com/mengkodingan.png" } }, { upload: ctx._client.waUploadToServer })
  let cards = new CarouselBuilder()
    .addCard({
      body: "BODY 1",
      footer: "FOOTER 1",
      header: {
        title: "HEADER TITLE 1",
        hasMediaAttachment: true,
        ...exampleMediaAttachment
      },
      nativeFlowMessage: { buttons: [button] }
    })
    .addCard({
      body: "BODY 2",
      footer: "FOOTER 2",
      header: {
        title: "HEADER TITLE 2",
        hasMediaAttachment: true,
        ...exampleMediaAttachment
      },
      nativeFlowMessage: { buttons: [button] }
    })
    .build();


  ctx.replyInteractiveMessage({ 
      body: "this is body",
      footer: "this is footer",
      carouselMessage: {
          cards,
      },
  });
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

