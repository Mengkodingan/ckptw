---
sidebar_position: 2
---

# Basic Command

Create a basic command for your bot.

## Basic

Creating an command is a simple thing in **@mengkodingan/ckptw**. After initialize bot you can use use *command* object for creating a command. example:

```js showLineNumbers
bot.command({
    name: "ping",
    code: async(ctx) => {
        // code goes here
        ctx.reply(ctx.id, { text: 'pong!' });
    }
});
```
