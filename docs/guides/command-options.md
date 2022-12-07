---
sidebar_position: 3
---

# Command Options

## All Options

| Options | Default Value | Can Be | Required? | Description
| ---- | ---- | ---- | ---- | ---- |
| name | `undefined` | `string` | ✅ | command name
| code | `undefined` | `function`, `asyncFunction` | ✅ | command code
| nonPrefixed | `false` | `boolean` | ❌ | should the command can run without prefix?
| aliases | `[]` | `string`, `array` | ❌ | command aliases
| cooldown | `0` | `number` | ❌ | cooldown time in ms
