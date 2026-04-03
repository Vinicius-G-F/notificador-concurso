require('dotenv').config();
const { Telegraf } = require('telegraf');

const twilio = require('twilio');
const client = twilio(
    process.env.ACCOUNT_SID_WHATSAPP,
    process.env.AUTH_TOKEN_WHATSAPP
);

function enviarMensagemWhatsApp(mensagem) {
    return client.messages.create({
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+5522998911117',
        body: mensagem
    })
}

function enviarMensagemTelegram(mensagem) {
    const token = process.env.TOKEN_TELEGRAM;
    const chatId = process.env.CHAT_ID_TELEGRAM;

    try {
        const bot = new Telegraf(token);
        bot.telegram.sendMessage(chatId, mensagem);
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    enviarMensagemWhatsApp,
    enviarMensagemTelegram
};