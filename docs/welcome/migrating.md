---
sidebar_position: 3
---

# Migrating from v0.0.12 to v1

### new setup

I think this is more suitable and can be more human readable... right?

```diff showLineNumbers
const { Client } = require("@mengkodingan/ckptw");
const bot = new Client({
  name: "something",
  prefix: "!",
  autoRead: true,
});

- bot.init().then(() => {
-   bot.onConnectionUpdate();
-   bot.onCredsUpdate();
-   bot.onMessage();
-
-   bot.command({
-     name: "ping",
-     code: async (ctx) => {
-       ctx.sendMessage(ctx.id, { text: "pong!" });
-     },
-   });
-  });

+ bot.ev.once('ready', (m) => {
+   console.log(`ready at ${m.user.id}`);
+ });
+
+ bot.command({
+   name: "ping",
+   code: async (ctx) => {
+     ctx.sendMessage(ctx.id, { text: "pong!" });
+   },
+ });
+
+ bot.launch();
```

### reply now without jid

if earlier version used jid parameter, now it doesn't exist... if you want to keep jid as parameter you can use `ctx.replyWithJid`.

```diff showLineNumbers
- ctx.reply(id, { text: "abc" });
+ ctx.reply({ text: "abc" });
```


### get sender details

```diff
- ctx.sender()
+ ctx.sender
```

return an object with values:
- `jid`: sender jid
- `pushName`: sender push name