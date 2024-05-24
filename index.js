const TelegramBot = require('node-telegram-bot-api');

const token = '7019749860:AAHRLfTn1I1vJbdz_Dj1B4BVyWR8osLrht8';
const webAppUrl = 'https://traders-journal-neon.vercel.app';
const apiUrl = 'https://journalwebapi.azurewebsites.net';

const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        const payload = {
            username: msg.chat.username, 
            telegramId: chatId.toString()      
        };

        try {
            const res = await fetch(apiUrl + '/TGLogin', {
                method: "POST",
                headers: {
                    "Accept": "*/*",             
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                console.error('Failed to create account:', res.statusText);
                return;
            }

            const user = await res.json();
            const url = webAppUrl + `/telegram?email=${user.data.email}&password=${user.data.password}`;

            await bot.sendMessage(chatId, 'Account created!', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Log in Journal', web_app: { url: url } }]
                    ]
                }
            });
        } catch (error) {
            console.error('Error during the API request:', error);
        }
    }
});
