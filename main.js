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


let rodarPrimeiroHorario = true;
let rodarSegundoHorario = true;
let rodarTerceiroHorario = true;
let rodarQuartoHorario = true;


cron.schedule('*/5 10 * * 1-5', async () => {
  if(!rodarPrimeiroHorario){
    return
  }
  await enviarMensagem(
    `Fazendo a primeira verificação do dia...`
  );
  await verificar();

  rodarPrimeiroHorario = false;
  rodarSegundoHorario = true;
  rodarTerceiroHorario = true;
  rodarQuartoHorario = true;
});
cron.schedule('*/5 12 * * 1-5', async () => {
  if(!rodarSegundoHorario){
    return
  }
  await verificar();
  rodarPrimeiroHorario = true;
  rodarSegundoHorario = false;
  rodarTerceiroHorario = true;
  rodarQuartoHorario = true;
});
cron.schedule('*/5 16 * * 1-5', async () => {
  if(!rodarTerceiroHorario){
    return
  }
  await verificar();
  rodarPrimeiroHorario = true;
  rodarSegundoHorario = true;
  rodarTerceiroHorario = false;
  rodarQuartoHorario = true;
});
cron.schedule('*/5 18 * * 1-5', async () => {
  if(!rodarQuartoHorario){
    return
  }
  await verificar();
  rodarPrimeiroHorario = true;
  rodarSegundoHorario = true;
  rodarTerceiroHorario = true;
  rodarQuartoHorario = false;
});
