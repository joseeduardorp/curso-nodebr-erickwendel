const { obterPessoas } = require('./service');

Array.prototype.meuReduce = function (callback, valorInicial) {
	let valorFinal = typeof valorInicial !== undefined ? valorInicial : this[0];

	for (let index = 0; index <= this.length - 1; index++) {
		valorFinal = callback(valorFinal, this[index], this);
	}

	return valorFinal;
};

async function main() {
	try {
		const { results } = await obterPessoas('a');
		const alturas = results.map((item) => parseInt(item.height));

		const alturaTotal = alturas.reduce((anterior, atual) => {
			return anterior + atual;
		}, 0);
		console.log('alturaTotal:', alturaTotal);

		const minhaLista = [
			['José', 'Eduardo'],
			['Javascript', 'Typescript'],
		];
		const listaConcatenada = minhaLista
			.meuReduce((anterior, atual) => anterior.concat(atual), [])
			.join(', ');

		console.log('listaConcatenada:', listaConcatenada);
	} catch (error) {
		console.error('Houve um erro interno', error);
	}
}

main();
