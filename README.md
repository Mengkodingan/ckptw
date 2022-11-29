# ckptw
easy way to create a Whatsapp Bot. Fork version of [whatscode.js](https://github.com/JastinXyz/whatscode.js) but we make it not a string-based command. We just need an package to create Whatsapp Bot with some lines of code, so we create this package.

Documentation is comming soon!

# install

```bash
npm i @mengkoding/ckptw
```

# example

```js
const { Client } = require('@mengkodingan/ckptw');
const bot = new Client({
    name: "idk",
    prefix: "!",
    printQRInTerminal: true
});

bot.onConnectionUpdate();
bot.onCredsUpdate();
bot.onMessage();

bot.command({
    name: "ping",
    code: async(ctx) => {
        ctx.sendMessage(ctx.id, { text: "pong!" })
    }
})
```