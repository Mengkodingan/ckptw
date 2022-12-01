---
sidebar_position: 1
---

# Section Builder

make a sections message with Section Builder.

## How

```js
const { SectionBuilder } = require("@mengkodingan/ckptw");

// you can use more than 1 like buttons
const a = new SectionBuilder()
  .setTitle("title") // sections title
  .setRows(
    { title: "abc", rowId: 1 },
    { title: "b", rowId: 2, description: "a" }
  ); // make a rows

ctx.sendMessage(ctx.id, {
  text: "buttons",
  buttonText: "button text", // buttonText is for the display text for the button
  sections: [a], // pass it into sections array
});
```
