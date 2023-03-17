# ckptw

easy way to create a Whatsapp Bot.

- **✨ Effortless**
- **🛒 Collector**
- **🧱 Builder**
- **⏳ Cooldown**
- **🔑 Command handler**
- **🎉 Many more!**

## Installation

```bash
npm install @mengkodingan/ckptw
```

## Example

```ts
import { Client } from "@mengkodingan/ckptw";
import { Events } from "@mengkodingan/ckptw/Constant";

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

## Client Configuration

```ts
export interface ClientOptions {
    /* as browser name */ 
    name: string;
    /* the bot prefix */
    prefix: Array<string>|string;
    /* should bot mark as read the incomming messages? */
    readIncommingMsg?: boolean;
    /* path to the auth/creds directory */
    authDir?: string;
    /* print the qr in terminal? */
    printQRInTerminal?: boolean;
}
```

## Command Options

```ts
export interface CommandOptions {
    /* command name */
    name: string;
    /* command aliases */
    aliases?: Array<string>;
    /* command code */
    code: (ctx: Ctx) => Promise<any>;
}
```

## Command Handler

With command handler you dont need all your command is located in one file.

- #### in your main file
  ```ts
  import { CommandHandler } from "@mengkodingan/ckptw";
  import path from "path";

  /* ... */
  const cmd = new CommandHandler(bot, path.resolve() + '/CommandsPath');
  cmd.load();

  /* ...bot.launch() */
  ```

- #### in your command file
  ```ts
  module.exports = {
      name: "ping",
      code: async (ctx) => {
        ctx.reply({ text: "pong!" });
      },
  };
  ```

## Command Cooldown

Cooldown can give a delay on the command. This can be done to prevent users from spamming your bot commands.

```diff
+ import { Cooldown } from "@mengkodingan/ckptw";

bot.command({
  name: "ping",
  code: async (ctx) => {
+    const cd = new Cooldown(ctx, 8000);
+    if(cd.onCooldown) return ctx.reply({ text: `slow down... wait ${cd.timeleft}ms` });

    ctx.sendMessage(ctx.id, { text: "pong!" });
  },
});
```

if you want to trigger some function when the cooldown end, you can use the "end" events in the cooldown:

> ⚠
> Will always be triggered when the cooldown is over (even though he only runs the command once)

```ts
cd.on("end", () => {
  ctx.reply({ text: "cd timeout" });
})
```

Cooldown getter:

```ts
/* check if sender is on cooldown */
cd.onCooldown; // boolean

/* check the cooldown time left (in ms) */
cd.timeleft; // number
```

## Builder

- #### Button
  make a button message with Button Builder.

  ```ts
  import { ButtonBuilder } from "@mengkodingan/ckptw";

  // you can use more than 1 builder
  const btn = new ButtonBuilder()
    .setId("id1") // button id
    .setDisplayText("button 1") // button text
    .setType(1); // type

  // pass it into buttons array
  ctx.sendMessage(ctx.id, { text: "buttons", buttons: [btn] });
  ```

- #### Sections
  Sections message is like a list.

  ```ts
  import { SectionBuilder } from "@mengkodingan/ckptw";

  // you can use more than 1 like buttons
  const a = new SectionBuilder()
    .setTitle("title") // sections title
    .setRows(
      { title: "abc", rowId: 1 },
      { title: "b", rowId: 2, description: "a" }
    ); // make a rows

  ctx.sendMessage(ctx.id, {
    text: "sections",
    buttonText: "button text", // buttonText is for the display text for the button
    sections: [a], // pass it into sections array
  });
  ```

## Collector

There are several options that can be used in the collector:
```ts
export interface CollectorArgs {
    /* collector timeout in milliseconds */
    time?: number;
    /* how many messages have passed through the filter */
    max?: number;
    /* will be stop if end reason is match with your col.stop reason  */
    endReason?: string[];
    /* limit how many messages must be processed. */
    maxProcessed?: number;
    /* a function as a filter for incoming messages. */
    filter?: () => boolean;
}
```

- #### Message Collector
  ```ts
  let col = ctx.MessageCollector({ time: 10000 }); // in milliseconds
  ctx.reply({ text: "say something... Timeout: 10s" });

  col.on("collect", (m) => {
      console.log("COLLECTED", m); // m is an Collections
      ctx.sendMessage(ctx.id, {
          text: `Collected: ${m.content}\nFrom: ${m.sender}`,
      });
  });

  col.on("end", (collector, r) => {
      console.log("ended", r); // r = reason
      ctx.sendMessage(ctx.id, { text: `Collector ended` });
  });
  ```

## Events

Firstly you must import the Events Constant like this:
```ts
import { Events } from "@mengkdoingan/ckptw/Constant";
```


- #### Available Events:
  - **ClientReady** - Emitted when the bot client is ready.
  - **MessagesUpsert** - Received an messages.
  - **QR** - The bot QR is ready to scan. Return the QR Codes.
  - **GroupsJoin** - Emitted when bot joining groups.
  - **UserJoin** - Emitted when someone joins a group where bots are also in that group.
  - **UserLeave** - Same with **UserJoin** but this is when the user leaves the group.

## Misc

```ts
/* replying message */
ctx.reply({ text: "test" });
ctx.reply({ ... });

/* add react */
ctx.react(jid: string, emoji: string, key?: object);
ctx.react(ctx.id, "👀");

/* get the bot ready at timestamp */
bot.readyAt;

/* get the current jid */
ctx.id // string;

/* get the array of arguments used */
ctx.args // Array<string>;

/* get sender details */
ctx.sender // { jid: string, pushName: string }
```