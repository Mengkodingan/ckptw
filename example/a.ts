import { Client } from "../lib";
import { Events } from "../lib/Constant";

let bot = new Client({
    name: 'test',
    prefix: ['!'],
    printQRInTerminal: true,
    readIncommingMsg: true,
})

bot.ev.on(Events.ClientReady, (m) => {
    console.log('ready at', m.user.id)
})

bot.command('test', async(ctx) => {
    ctx.reply('aaa');
})

bot.launch();