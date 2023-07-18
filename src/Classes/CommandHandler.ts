import { walk } from "../Common/Functions";


export class CommandHandler {
    _bot: any;
    _path: string;

    /**
     * Create a new command handler instance
     * 
     * ```ts
     * import { CommandHandler } from "@mengkodingan/ckptw";
     * import path from "path";
     * 
     * const cmd = new CommandHandler(bot, path.resolve() + '/path/to/dir');
     * cmd.load();
     * 
     * ```
     * 
     * @param bot The bot instance
     * @param path A string that represent a path to commands directory. Recomended using `path` library.
     * 
     * ```ts
     * import path from "path";
     * const cmd = new CommandHandler(bot, path.resolve() + '/path/to/dir');
     * ```
     */
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