import { Client, Events } from "../lib";

const bot = new Client({
    prefix: "!",
    printQRInTerminal: false,
    readIncommingMsg: true,
    usePairingCode: true,
    phoneNumber: '6285931594034', // phone number, e.g 62xxxxx
    WAVersion: [2, 3000, 1017531287],
});

bot.ev.once(Events.ClientReady, (m) => {
    console.log(`ready at ${m.user.id}`);
});

bot.command('ping', async(ctx) => ctx.reply({ text: 'pong!' }));

bot.launch();