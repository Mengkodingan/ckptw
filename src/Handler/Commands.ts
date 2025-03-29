import { arrayMove } from "../Common/Functions";
import { Ctx } from "../Classes/Ctx";
import { ICommandOptions, ICtxSelf } from "../Common/Types";

export = async (self: ICtxSelf, runMiddlewares: (ctx: Ctx, index?: number) => Promise<boolean>) => {
    let { cmd, prefix, m } = self;

    if (!m?.message || m.key?.remoteJid === "status@broadcast") return;
    if (!self.selfReply && m.key.fromMe) return;

    const hasHears = Array.from(self.hearsMap.values()).filter((x) => 
        x.name === m.content || 
        x.name === m.messageType || 
        new RegExp(x.name).test(m.content as string) || 
        (Array.isArray(x.name) && x.name.includes(m.content))
    );

    if (hasHears.length) return hasHears.forEach((x) => x.code(new Ctx({ used: { hears: m.content }, args: [], self, client: self.core })));

    let commandsList = Array.from(cmd?.values() ?? []);
    let selectedPrefix: string | undefined;

    if (Array.isArray(prefix)) {
        if (prefix[0] == "") {
            const emptyIndex = prefix.findIndex((x) => x.includes(""));
            prefix = arrayMove(prefix, emptyIndex - 1, prefix.length - 1);
        } else {
            selectedPrefix = prefix.find((p) => m.content?.startsWith(p));
        }
    } else if (prefix instanceof RegExp) {
        const match = m.content?.match(prefix);
        if (match) selectedPrefix = match[0];
    }

    if (!selectedPrefix) return;

    let args = m.content?.slice(selectedPrefix.length).trim().split(/\s+/) || [];
    let commandName = args?.shift()?.toLowerCase();

    if (!commandName) return;

    const matchedCommands = commandsList.filter((c: ICommandOptions) => 
        c.name.toLowerCase() === commandName ||
        (Array.isArray(c.aliases) ? c.aliases.includes(commandName as string) : c.aliases === commandName)
    );

    if (!matchedCommands.length) return;

    let ctx = new Ctx({ used: { prefix: selectedPrefix, command: commandName }, args, self, client: self.core });
    if (!(await runMiddlewares(ctx))) return;

    matchedCommands.forEach((cmd) => cmd.code(ctx));
};
