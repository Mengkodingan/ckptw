import { arrayMove } from "../Common/Functions";
import { Ctx } from "../Classes/Ctx";
import { ICommandOptions, ICtxSelf } from "../Common/Types";
import { Collection } from "@discordjs/collection";

export = async (self: ICtxSelf) => {
    let { cmd, prefix, m } = self;

    if (!m || !m.message || m.key.fromMe || (m.key && m.key.remoteJid === "status@broadcast")) return;

    const hasHears = Array.from(self.hearsMap.values()).filter((x) => (x.name === m.content) || (x.name === m.messageType) || (new RegExp(x.name).test(m.content as string)) || (Array.isArray(x.name) ? x.name.includes(m.content) : false));
    if (hasHears.length) return hasHears.map((x) => x.code(new Ctx({ used: { hears: m.content }, args: [], self, client: self.core })));

    let allCommandsValue = Array.from(cmd?.values() as unknown as ArrayLike<unknown>);

    let args: Array<string>;
    let command: string;

    let selectedPrefix: string | undefined;
    if (Array.isArray(prefix)) {
        if (prefix[0] == "") {
            const emptyIndex = prefix.indexOf(prefix.filter((x: string | string[]) => x.includes("")).join(""));
            prefix = arrayMove(prefix as any, emptyIndex - 1, prefix.length - 1) as any;
        } else {
            selectedPrefix = prefix.find((p: any) => m.content?.startsWith(p));
        }
    } else if (prefix instanceof RegExp) {
        if(prefix.test(m.content as string)) {
            let match = m.content?.match(prefix);
            if(match) selectedPrefix = match[0];
        }
    }

    if (!selectedPrefix) return;

    args = m.content?.slice(selectedPrefix.length).trim().split(/ +/g) as Array<string>;
    command = args?.shift()?.toLowerCase() as string;

    const commandDetail = allCommandsValue.filter(
        (c: any) =>
            c.name.toLowerCase() === command.toLowerCase() ||
            (c.aliases && typeof c.aliases === "object"
                ? c.aliases.includes(command.toLowerCase())
                : c.aliases === command.toLowerCase())
    ) as Array<ICommandOptions>;

    if (commandDetail.length) commandDetail.map((x) => x.code(new Ctx({ used: { prefix: selectedPrefix, command }, args, self, client: self.core })));
};
