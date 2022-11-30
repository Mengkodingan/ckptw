# ckptw

easy way to create a Whatsapp Bot. Fork version of [whatscode.js](https://github.com/JastinXyz/whatscode.js) but we make it not a string-based command. We just need an package to create Whatsapp Bot with some lines of code, so we create this package.

Documentation is comming soon!

# install

```bash
npm i @mengkodingan/ckptw
```

# example

```js
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

# misc
- Buttons
    ```js
    const { ButtonBuilder } = require("@mengkodingan/ckptw");

    // you can use more than 1 builder and pass it into the array in ctx
    const btn = new ButtonBuilder()
        .setId('id1')
        .setDisplayText('button 1')
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

    ctx.sendMessage(ctx.id, { text: "buttons", buttonText: 'button text', sections: [a] });
    ```

- React
    ```js
    ctx.react(id, '🎈')
    ```