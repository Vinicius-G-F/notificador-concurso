const cron = require('node-cron');
const contarConvocados = require('./scraper');
const enviarMensagem = require('./notifier');
const fs = require('fs');

const ARQUIVO = './estado.json';

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

    await enviarMensagem(
      `🚨 ALTERAÇÃO DETECTADA!\n\n${JSON.stringify(resultadoAtual, null, 2)}`
    );

    fs.writeFileSync(ARQUIVO, JSON.stringify(resultadoAtual));
  } else {
    console.log('Nenhuma mudança.');
  }
}


cron.schedule('0 10 * * 1-5', async () => {
  await enviarMensagem(
    `Fazendo a primeira verificação do dia...`
  );
  await verificar();
});
cron.schedule('0 12 * * 1-5', async () => {
  await verificar();
});
cron.schedule('0 16 * * 1-5', async () => {
  await verificar();
});
cron.schedule('30 17 * * 1-5', async () => {
  await verificar();
});

