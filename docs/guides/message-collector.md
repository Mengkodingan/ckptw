---
sidebar_position: 4
---

# Message Collector

The collector is useful if you want to get incoming messages before the collector expires. The collector here is also quite similar to the collector in [discord.js](https://discordjs.guide/popular-topics/collectors.html#message-collectors).

## Basic

```js showLineNumbers
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

There are several configurations in the Message Collector:
- `time`: collector timeout.
- `filter`: a function as a filter for incoming messages.
- `max`: the maximum number of messages that have successfully passed the filter.
- `maxProcessed`: the maximum number of messages that processed by collector.