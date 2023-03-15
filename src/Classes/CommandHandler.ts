import { walk } from "../Common/Functions";

export class CommandHandler {
    _bot: any;
    _path: string;

    constructor(bot: any, path: string) {
        this._bot = bot;
        this._path = path;
    }

    load() {
        walk(this._path, (x: string): any => {
          let cmdObj = require(x);
          this._bot.cmd.set(cmdObj.name, cmdObj);
          console.log(`[ckptw CommandHanlder] Loaded - ${cmdObj.name}`);
        });
    }
}