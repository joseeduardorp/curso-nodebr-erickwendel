const { deepEqual, ok } = require('assert');

const db = require('./database');

const DEFAULT_ITEM_CADASTRAR = {
	id: 1,
	nome: 'Homem de Ferro',
	poder: 'Super Força e Voo',
};

describe('Suite de manipulação de Heróis', () => {
	before(async () => {
		await db.cadastrar(DEFAULT_ITEM_CADASTRAR);
	});

	it('deve pesquisar um herói pelo id, usando arquivos', async () => {
		const expected = DEFAULT_ITEM_CADASTRAR;
		const [resultado] = await db.listar(expected.id);

		deepEqual(resultado, expected);
	});

	it('deve cadastrar um herói, usando arquivos', async () => {
		const novoHeroi = {
			id: 2,
			nome: 'Hulk',
			poder: 'Super Força',
		};

		const expected = novoHeroi;
		await db.cadastrar(novoHeroi);

		const [heroi] = await db.listar(novoHeroi.id);

		deepEqual(heroi, expected);
	});

	it('deve remover o herói pelo id, usando arquivos', async () => {
		const expected = true;
		const resultado = await db.remover(DEFAULT_ITEM_CADASTRAR.id);

		deepEqual(resultado, expected);
	});
});
