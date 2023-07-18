import { Client } from "../lib";
import { Events } from "../lib/Constant";

const bot = new Client({
    name: "something",
    prefix: "!",
    readIncommingMsg: true
});

bot.ev.once(Events.ClientReady, (m) => {
    console.log(`ready at ${m.user.id}`);
});

bot.ev.on(Events.MessagesUpsert, (m) => {
    if(m.key.fromMe) return;
    if(m.content === bot.prefix + "ping") {
        bot.core.sendMessage(m.key.remoteJid, { text: "pong!" });
    }
})

bot.launch();