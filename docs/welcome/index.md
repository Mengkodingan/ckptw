---
sidebar_position: 1
slug: /
---

# Introduction

easy way to create a Whatsapp Bot. Fork version of [whatscode.js](https://github.com/JastinXyz/whatscode.js) but we make it not a string-based command. We just need an package to create Whatsapp Bot with some lines of code, so we create this package.

- 📕 Explore the documentation at: *https://ckptw.mengkodingan.my.id*
- 🤔 Whats new? *https://ckptw.mengkodingan.my.id/docs/welcome/whats-new*

## Installation

```bash
# install it from npm
npm i @mengkodingan/ckptw

# or install it from Github for more new features, some bug fixes, and maybe theres some bugs too.
npm i github:mengkodingan/ckptw
```

## Setup

```js showLineNumbers
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