---
sidebar_position: 2
---

# Command Handler

With command handler you dont need all your command is located in one file.

```js title="in your main file" showLineNumbers
const { CommandHandler } = require("@mengkodingan/ckptw");
const path = require("path");
const cmdHandler = new CommandHandler(bot, `${path.resolve()}/SomePath/`);
cmdHandler.load();
```

```js title="in command file"
module.exports = {
    name: "ping",
    code: async (ctx) => {
      ctx.reply(ctx.id, { text: "pong!" });
    },
};
```

## Command Handler Example

```js showLineNumbers
const { Client, CommandHandler } = require("@mengkodingan/ckptw");
const path = require("path");
const bot = new Client({
  name: "something",
  prefix: "!",
  autoRead: true,
});

bot.ev.once('ready', (m) => {
  console.log(`ready at ${m.user.id}`);
});

const cmdHandler = new CommandHandler(bot, `${path.resolve()}/commands/`);
cmdHandler.load();

bot.launch();
```
