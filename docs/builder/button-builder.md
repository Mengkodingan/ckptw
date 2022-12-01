---
sidebar_position: 1
---

# Button Builder

make a button message with Button Builder.

## How

```js
const { ButtonBuilder } = require("@mengkodingan/ckptw");

// you can use more than 1 builder
const btn = new ButtonBuilder()
  .setId("id1") // button id
  .setDisplayText("button 1") // button text
  .setType(1); // type

// pass it into buttons array
ctx.sendMessage(ctx.id, { text: "buttons", buttons: [btn] });
```