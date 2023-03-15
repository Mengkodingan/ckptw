# ckptw

easy way to create a Whatsapp Bot. Fork version of [whatscode.js](https://github.com/JastinXyz/whatscode.js) but we make it not a string-based command. We just need an package to create Whatsapp Bot with some lines of code, so we create this package.

- 📕 Explore the documentation at: *https://ckptw.mengkodingan.my.id*
- 🤔 Whats new? *https://ckptw.mengkodingan.my.id/docs/welcome/whats-new*

## Installation

```bash
npm install @mengkodingan/ckptw
```

## Setup

```ts
import { Client, Events } from "@mengkodingan/ckptw";
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

bot.launch();
```

## Command Handler
```ts
import { CommandHandler } from "@mengkodingan/ckptw";
import path from "path";

// ...
const cmd = new CommandHandler(bot, path.resolve() + '/CommandsPath');
cmd.load();

// ... bot.launch()
```