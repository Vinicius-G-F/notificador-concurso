const axios = require('axios');
const cheerio = require('cheerio');
const links = {
    tecnicoRedes: "https://www.indaiatuba.sp.gov.br/administracao/rh/concurso-publico/lista-de-aprovados/1/2025/500/",
    tecnicoHardware: "https://www.indaiatuba.sp.gov.br/administracao/rh/concurso-publico/lista-de-aprovados/1/2025/499/",
    especialistaRedes: "https://www.indaiatuba.sp.gov.br/administracao/rh/concurso-publico/lista-de-aprovados/1/2025/560/",
    especialistaHardware: "https://www.indaiatuba.sp.gov.br/administracao/rh/concurso-publico/lista-de-aprovados/1/2025/559/"
}
async function contarConvocados() {
    const convocadoQtd = {}
    for(const cargo in links){
        try {
            const { data } = await axios.get(links[cargo]);
    
            const $ = cheerio.load(data);
    
            // Pega a div com id texto_pagina
            const div = $('#texto_pagina');
    
            // Pega apenas a PRIMEIRA tabela dentro dela
            const primeiraTabela = div.find('table').first();
    
            let contador = 0;
    
            // Percorre todos os td da primeira tabela
            primeiraTabela.find('td').each((i, el) => {
                const texto = $(el).text().trim();
    
                if (texto === 'CONVOCADO') {
                    contador++;
                }
            });
            convocadoQtd[cargo] = contador;
    
        } catch (error) {
            console.error('Erro no scraping:', error.message);
        }
    }
    return convocadoQtd;
}


module.exports = contarConvocados;