const axios = require("axios");

module.exports = class Telegram {
    sendTelegramMessage(message) {
        const botId = process.env.TELEGRAM_BOTID;
        const chatId = process.env.TELEGRAM_CHATID;

        if (!botId || !chatId) {
            return;
        }

        const telegramMsg = encodeURIComponent(message);

        const url = `https://api.telegram.org/${botId}/sendMessage?chat_id=${chatId}&text=${telegramMsg}`;
        axios.get(url);
    }
};
