const cron = require('node-cron');
const contarConvocados = require('./scraper');
const {enviarMensagemWhatsApp, enviarMensagemTelegram} = require('./notifier');
const fs = require('fs');

const ARQUIVO = './estado.json';
async function enviarMensagem(mensagem) {
  enviarMensagemWhatsApp(mensagem);
  enviarMensagemTelegram(mensagem);
}
// Função principal
async function verificar() {
  const resultadoAtual = await contarConvocados();

  let resultadoAnterior = null;

  if (fs.existsSync(ARQUIVO)) {
    resultadoAnterior = JSON.parse(fs.readFileSync(ARQUIVO));
  }

  // Comparação simples
  if (JSON.stringify(resultadoAtual) !== JSON.stringify(resultadoAnterior)) {
    console.log('Mudança detectada!');
    try{
      await enviarMensagem(
        `🚨 ALTERAÇÃO DETECTADA!\n\n${JSON.stringify(resultadoAtual, null, 2)}`
      );
      fs.writeFileSync(ARQUIVO, JSON.stringify(resultadoAtual));
    }
    catch(e){
      console.error(e);
    }
  } else {
    console.log('Nenhuma mudança.');
  }
}

const horarios = ["10:00", "12:00", "16:00", "18:00"];
let ultimaExecucao = null;

cron.schedule("*/5 * * * 1-5", async () => {
  const agora = new Date();
  const horaAtual = agora.toTimeString().slice(0,5); // HH:MM
  const dataAtual = agora.toISOString().slice(0,10); // YYYY-MM-DD

  if (!horarios.includes(horaAtual)) return;

  const chaveExecucao = `${dataAtual}-${horaAtual}`;

  if (ultimaExecucao === chaveExecucao) return;

  ultimaExecucao = chaveExecucao;

  if (horaAtual === "10:00") {
    await enviarMensagem("Fazendo a primeira verificação do dia...");
  }

  await verificar();
});
enviarMensagem("mensagem de teste!");