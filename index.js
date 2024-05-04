const TelegramBot = require('node-telegram-bot-api');

const token = '7019749860:AAHRLfTn1I1vJbdz_Dj1B4BVyWR8osLrht8';
const webAppUrl = 'https://traders-journal-neon.vercel.app';
const apiUrl = 'https://journalapi.azurewebsites.net'

const bot = new TelegramBot(token, {polling: true});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/start') {
        const res = await fetch(apiUrl + '/TGLogin', {
            method: "POST",
            mode: 'no-cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(msg.chat.username)
        });

        const user = await res.json();
        const url = webAppUrl + `/telegram?email=${user.data.email}&password=${user.data.password}`;

        await bot.sendMessage(chatId, 'Account created!', {
            reply_markup: {
                keyboard: [
                    [{text: 'Open Journal', web_app: {url: url}}]
                ]
            }
        })
    }
})