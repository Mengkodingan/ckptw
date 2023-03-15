import { arrayMove, getContentFromMsg } from "../Models/Functions";
import { Ctx } from "../Classes/Ctx";

interface ValInterface {
    name: string;
    code: (ctx: Ctx) => Promise<void>;
    aliases?: string|Array<String>;
}

export = async (self: { whats: any; cmd: any; prefix: any; m: any; }) => {
    let { cmd, prefix, m } = self;
    
    let msg = m.messages[0];
    let fromMe = msg.key.fromMe;

    if (!m || !msg.message) return;
    if(fromMe) return;
    if (msg.key && msg.key.remoteJid === "status@broadcast") return;
    let dy = getContentFromMsg(msg);

    let args: string[];
    let command: String;
    const valArr = Array.from(cmd.values());

    if (prefix[0] == "") {
        const emptyIndex = prefix.indexOf(
            prefix.filter((x: string | string[]) => x.includes("")).join("")
        );

        prefix = arrayMove(prefix, emptyIndex - 1, prefix.length - 1);
    }

    const startsP = prefix.find((p: any) => dy?.startsWith(p));
    if(!startsP) return;

    args = dy?.slice(startsP.length).trim().split(/ +/g) as Array<string>;
    command = args?.shift()?.toLowerCase() as String;

    const val = valArr.find(
        (c:any) =>
        c.name.toLowerCase() === command.toLowerCase() ||
        (c.aliases && typeof c.aliases === "object"
            ? c.aliases.includes(command.toLowerCase())
            : c.aliases === command.toLowerCase())
    ) as ValInterface;

    if (val) val.code(new Ctx({ used: { prefix: startsP, command }, args, self, client: self.whats }));
};
