const { toLog } = require('@mengkodingan/tolog');
const { walk } = require('../Models/functions');

module.exports = class CommandHandler {
    constructor(bot, path) {
        if(!bot) throw new Error('[ckptw] missing bot parameter in command handler class.')
        if(!path) throw new Error('[ckptw] folder parameter in command handler class is required!');

        this.bot = bot;
        this.path = path;
    }

    load() {
      walk(this.path, (x) => {
        let cmdObj = require(x);
        this.bot.CMD.set(cmdObj.name, cmdObj);
        toLog(2, `Loaded - ${cmdObj.name}`, "CommandHandler");
      });
    }
}