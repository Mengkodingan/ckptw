---
sidebar_position: 5
---

# Cooldown System

Cooldown can give a delay on the command. This can be done to prevent users from spamming your bot commands.

## Example

```js showLineNumbers
bot.command({
  name: "test",
  cooldown: 10000, // in milliseconds
  code: (ctx) => {
    // check if the sender is still on cooldown
    if(ctx.isCooldown) {
      ctx.reply({ text: `slow down, wait ${ctx.cooldownRemaining}ms`}); // 

      // your callback in onCooldownTimeout will be trigger if the cooldown end
      ctx.onCooldownTimeout(() => {
        ctx.reply({ text: "cooldown end" });
      })
    } else {
      ctx.reply({ text: "yay!" });
    }
  }
});
```