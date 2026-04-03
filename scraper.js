const axios = require('axios');
const cheerio = require('cheerio');
const links = {
    tecnicoRedesQTD: "https://www.indaiatuba.sp.gov.br/administracao/rh/concurso-publico/lista-de-aprovados/1/2025/500/",
    tecnicoHardwareQTD: "https://www.indaiatuba.sp.gov.br/administracao/rh/concurso-publico/lista-de-aprovados/1/2025/499/",
    especialistaRedesQTD: "https://www.indaiatuba.sp.gov.br/administracao/rh/concurso-publico/lista-de-aprovados/1/2025/560/",
    especialistaHardwareQTD: "https://www.indaiatuba.sp.gov.br/administracao/rh/concurso-publico/lista-de-aprovados/1/2025/559/",
    editaisQTD: "https://www.indaiatuba.sp.gov.br/administracao/rh/editais-de-convocacao/"

}
async function contarConvocados() {
    const convocadoQtd = {}
    for (const chave in links) {
        let contador = 0;
        try {
            const { data } = await axios.get(links[chave]);

            const $ = cheerio.load(data);
            const chaves = Object.keys(links);
            if (chaves[chaves.length -1] === chave) {
                // Seleciona a primeira ul filha direta da div#texto_pagina
                const primeiraUl = $('#texto_pagina > ul').first();
                contador = primeiraUl.find('li').length;
            } else {
                // Pega a div com id texto_pagina
                const div = $('#texto_pagina');
                // Pega apenas a PRIMEIRA tabela dentro dela
                const primeiraTabela = div.find('table').first();

                // Percorre todos os td da primeira tabela
                primeiraTabela.find('td').each((i, el) => {
                    const texto = $(el).text().trim();

                    if (texto === 'CONVOCADO') {
                        contador++;
                    }
                });
            }
            convocadoQtd[chave] = contador;

        } catch (error) {
            console.error('Erro no scraping:', error.message);
        }
    }
    return convocadoQtd;
}

module.exports = contarConvocados;