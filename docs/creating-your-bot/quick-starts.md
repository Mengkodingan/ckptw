---
sidebar_position: 1
---

# Quick Starts

Create a simple Whatsapp bot just with some lines of code.

## Install the library

First of all, install **@mengkodingan/ckptw** library:

```bash title="bash"
# install it from npm
npm i @mengkodingan/ckptw

# or install it from Github for more new features, some bug fixes, and maybe theres some bugs too.
npm i github:mengkodingan/ckptw
```

## Make your first simple bot

Create your first bot using whatscode.js with just a few lines:

```js title="index.js"
const { Client } = require("@mengkodingan/ckptw");
const bot = new Client({
  name: "something",
  prefix: "!",
  autoRead: true,
});

bot.init().then(() => {
  bot.onConnectionUpdate();
  bot.onCredsUpdate();
  bot.onMessage();
  
  bot.command({
    name: "ping",
    code: async (ctx) => {
      ctx.sendMessage(ctx.id, { text: "pong!" });
    },
  });
});
```

## Run your bot

```bash title="bash"
node index.js
```

and then scan the qr in terminal with your Whatsapp... now you can start creating some Whatsapp bot.

:::tip
feel free to open an issue in our Github repository if you need help!
:::