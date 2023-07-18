import { arrayMove } from "../Common/Functions";
import { Ctx } from "../Classes/Ctx";
import { CommandOptions } from "../Common/Types";
import { Collection } from "@discordjs/collection";

export = async (self: { core: any; cmd: Collection<string, any>; prefix: any; m: any; hearsMap: Collection<string, any> }) => {
    let { cmd, prefix, m } = self;

    if (!m || !m.message || m.key.fromMe || (m.key && m.key.remoteJid === "status@broadcast")) return;

    const hasHears = Array.from(self.hearsMap.values()).filter((x) => (x.name === m.content) || (x.name === m.messageType ));
    if(hasHears.length) return hasHears.map((x) => x.code(new Ctx({ used: { hears: m.content }, args: [], self, client: self.core })));

    let allCommandsValue = Array.from(cmd.values());

    let args: Array<string>;
    let command: string;

    if (prefix[0] == "") {
        const emptyIndex = prefix.indexOf(prefix.filter((x: string | string[]) => x.includes("")).join(""));
        prefix = arrayMove(prefix, emptyIndex - 1, prefix.length - 1);
    }

    const selectedPrefix = prefix.find((p: any) => m.content?.startsWith(p));
    if (!selectedPrefix) return;

    args = m.content?.slice(selectedPrefix.length).trim().split(/ +/g) as Array<string>;
    command = args?.shift()?.toLowerCase() as string;

    const commandDetail = allCommandsValue.filter(
        (c) =>
            c.name.toLowerCase() === command.toLowerCase() ||
            (c.aliases && typeof c.aliases === "object"
                ? c.aliases.includes(command.toLowerCase())
                : c.aliases === command.toLowerCase())
    ) as Array<CommandOptions>;
    
    if (commandDetail.length) commandDetail.map((x) => x.code(new Ctx({ used: { prefix: selectedPrefix, command }, args, self, client: self.core })));
};
