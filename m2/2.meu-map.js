const service = require('./service');

Array.prototype.meuMap = function (callback) {
	const novoArrayMapeado = [];

	for (let indice = 0; indice <= this.length - 1; indice++) {
		const resultado = callback(this[indice], indice);

		novoArrayMapeado.push(resultado);
	}

	return novoArrayMapeado;
};

async function main() {
	try {
		const resultado = await service.obterPessoas('a');

		// const nomes = [];
		// resultado.results.forEach((pessoa) => {
		// 	nomes.push(pessoa.name);
		// });

		// const nomes = resultado.results.map((pessoa) => pessoa.name);

		const nomes = resultado.results.meuMap(
			(pessoa, indice) => `[${indice}] ${pessoa.name}`
		);

		console.log('nomes', nomes);
	} catch (error) {
		console.error('Houve um erro interno', error);
	}
}

main();
