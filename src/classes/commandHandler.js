const { toLog } = require('@mengkodingan/tolog');
const fs = require('fs');

module.exports = class CommandHandler {
    constructor(bot, path) {
        if(!bot) throw new Error('[ckptw] missing bot parameter in command handler class.')
        if(!path) throw new Error('[ckptw] folder parameter in command handler class is required!');

        this.bot = bot;
        var reader = fs
          .readdirSync(path)
          .filter((file) => file.endsWith(".js"));
        for (const file of reader) {
          this.cmdObj = require(path + file);
        }
    }

    load() {
        this.bot.CMD.set(this.cmdObj.name, this.cmdObj);
        toLog(2, `Loaded - <b>${this.cmdObj.name}</b>`, "CommandHandler");
    }
}