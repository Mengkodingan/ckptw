---
sidebar_position: 1
---

# Client Options

There are several additional options you can use in the client constructor. I guess it's still in its early stages so right now there are only a few options available... in the future we will provide more options according to their respective uses!

## All Options

| Options | Default Value | Can Be | Required? | Description
| ---- | ---- | ---- | ---- | ---- |
| name | `undefined` | `string` | ✅ | Bot Name
| prefix | `undefined` | `array`, `string` | ✅ | Bot Prefix
| autoRead | `false` | `boolean` | ❌ | Auto read the incomming message?
| authFolder | `./state` | `string` | ❌ | Path to session folder.
| printQRInTerminal | `true` | `booelan` | ❌ | Print the QR code to terminal?

:::caution
Before version **0.0.12** you should use **authFile** instead of **authFolder** (only change the options name)
:::