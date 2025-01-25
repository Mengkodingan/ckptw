import { Consolefy } from "@mengkodingan/consolefy";
import { walk } from "../Common/Functions";


export class CommandHandler {
    _bot: any;
    _path: string;
    consolefy?: Consolefy;

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

        this.consolefy = new Consolefy({ tag: 'command-handler' });
    }

    load(isShowLog: boolean = true) {
      if (isShowLog) this.consolefy?.group("Command Handler Load")
        walk(this._path, (x: string): any => {
          let cmdObj = require(x);
          if(!cmdObj.type || cmdObj.type === 'command') {
            this._bot.cmd.set(cmdObj.name, cmdObj);
            if (isShowLog) this.consolefy?.success(`Loaded Command - ${cmdObj.name}`);
          } else if(cmdObj.type === 'hears') {
            this._bot.hearsMap.set(cmdObj.name, cmdObj);
            if (isShowLog) this.consolefy?.success(`Loaded Hears - ${cmdObj.name}`);
          }
        });
      if (isShowLog) this.consolefy?.groupEnd();
    }
}