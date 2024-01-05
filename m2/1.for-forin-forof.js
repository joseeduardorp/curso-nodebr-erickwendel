/*
  Verificando a performance dos diferentes tipos de loop 'for'
*/

const service = require('./service');

async function main() {
	try {
		const resultado = await service.obterPessoas('a');
		const nomes = [];

		console.time('for');
		for (let i = 0; i < resultado.results.length - 1; i++) {
			const pessoa = resultado.results[i];
			nomes.push(pessoa.name);
		}
		console.timeEnd('for');

		console.time('forin');
		for (let i in resultado.results) {
			const pessoa = resultado.results[i];
			nomes.push(pessoa.name);
		}
		console.timeEnd('forin');

		console.time('forof');
		for (pessoa of resultado.results) {
			nomes.push(pessoa.name);
		}
		console.timeEnd('forof');

		console.log('nomes', nomes);
	} catch (error) {
		console.error('Houve um erro interno', error);
	}
}

main();
