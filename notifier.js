require('dotenv').config();
const twilio = require('twilio');
const client = twilio(
    process.env.ACCOUNT_SID,
    process.env.AUTH_TOKEN
);

function enviarMensagem(mensagem){
    client.messages.create({
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+5522998911117',
      body: mensagem
    })
    .then(message => console.log(message.sid))
    .catch(error => console.error(error));
}

module.exports = enviarMensagem;