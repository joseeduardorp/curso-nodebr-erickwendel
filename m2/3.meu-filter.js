const { obterPessoas } = require('./service');

Array.prototype.meuFilter = function (callback) {
	const listaFiltrada = [];

	for (index in this) {
		const item = this[index];
		const result = callback(item, index, this);

		if (!result) continue;

		listaFiltrada.push(item);
	}

	return listaFiltrada;
};

async function main() {
	try {
		const { results } = await obterPessoas('a');

		// const familiaLars = results.filter((item) => {
		// 	const result = item.name.toLowerCase().indexOf('lars') !== -1;

		// 	return result;
		// });

		const familiaLars = results.meuFilter((item, index, lista) => {
			console.log(`index: ${index}, length: ${lista.length}`);

			return item.name.toLowerCase().indexOf('lars') !== -1;
		});

		const nomes = familiaLars.map((pessoa) => pessoa.name);

		console.log('nomes', nomes);
	} catch (error) {
		console.log('Houve um erro interno', error);
	}
}

main();
