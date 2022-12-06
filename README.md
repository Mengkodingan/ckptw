# ckptw

easy way to create a Whatsapp Bot. Fork version of [whatscode.js](https://github.com/JastinXyz/whatscode.js) but we make it not a string-based command. We just need an package to create Whatsapp Bot with some lines of code, so we create this package.

- 📕 Explore the documentation at: *https://ckptw.mengkodingan.my.id*
- ♻ Read the changelog at: *https://ckptw.mengkodingan.my.id/docs/category/changelog*

# install

```bash
# install it from npm
npm i @mengkodingan/ckptw

# or install it from Github for more new features, some bug fixes, and maybe theres some bugs too.
npm i github:mengkodingan/ckptw
```

# example

```js
const { Client } = require("@mengkodingan/ckptw");
const bot = new Client({
  name: "something",
  prefix: "!",
  autoRead: true,
});

bot.ev.once('ready', (m) => {
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

# command handler

- main file

  ```js
  const { CommandHandler } = require("@mengkodingan/ckptw");
  const path = require("path");

  const cmdHandler = new CommandHandler(bot, `${path.resolve()}/SomePath/`);
  cmdHandler.load();
  ```

- in your command file
  ```js
  module.exports = {
    name: "name",
    // other configuration...
    code: async (ctx) => {
      ctx.sendMessage(ctx.id, { text: "yay!" });
    },
  };
  ```

# misc

- Buttons

  ```js
  const { ButtonBuilder } = require("@mengkodingan/ckptw");

  // you can use more than 1 builder and pass it into the array in ctx
  const btn = new ButtonBuilder()
    .setId("id1")
    .setDisplayText("button 1")
    .setType(1);

  ctx.sendMessage(ctx.id, { text: "buttons", buttons: [btn] });
  ```

- Sections

  ```js
  const { SectionBuilder } = require("@mengkodingan/ckptw");

  // you can use more than 1 like buttons
  const a = new SectionBuilder()
    .setTitle("title")
    .setRows(
      { title: "abc", rowId: 1 },
      { title: "b", rowId: 2, description: "a" }
    );

  ctx.sendMessage(ctx.id, {
    text: "buttons",
    buttonText: "button text",
    sections: [a],
  });
  ```

- Reaction message
  ```js
  ctx.react(id, "🎈");
  ```
