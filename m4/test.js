const { deepEqual, ok } = require('assert');

const db = require('./database');

const DEFAULT_ITEM_CADASTRAR = {
	id: 1,
	nome: 'Homem de Ferro',
	poder: 'Super Força e Voo',
};
const DEFAULT_ITEM_ATUALIZAR = {
	id: 2,
	nome: 'Homem Aranha',
	poder: 'Super Força e Agilidade',
};

describe('Suite de manipulação de Heróis', () => {
	before(async () => {
		await db.cadastrar(DEFAULT_ITEM_CADASTRAR);
		await db.cadastrar(DEFAULT_ITEM_ATUALIZAR);
	});

	it('deve pesquisar um herói pelo id, usando arquivos', async () => {
		const expected = DEFAULT_ITEM_CADASTRAR;
		const [resultado] = await db.listar(expected.id);

		deepEqual(resultado, expected);
	});

	it('deve cadastrar um herói, usando arquivos', async () => {
		const novoHeroi = {
			id: 3,
			nome: 'Hulk',
			poder: 'Super Força',
		};

		const expected = novoHeroi;
		await db.cadastrar(novoHeroi);

		const [heroi] = await db.listar(novoHeroi.id);

		deepEqual(heroi, expected);
	});

	it('deve remover um herói pelo id, usando arquivos', async () => {
		const expected = true;
		const resultado = await db.remover(DEFAULT_ITEM_CADASTRAR.id);

		deepEqual(resultado, expected);
	});

	it('deve atualizar um herói pelo id, usando arquivos', async () => {
		const novosDados = {
			nome: 'Feiticeira Escarlate',
			poder: 'Magia',
		};

		const expected = {
			...DEFAULT_ITEM_ATUALIZAR,
			...novosDados,
		};

		await db.atualizar(DEFAULT_ITEM_ATUALIZAR.id, novosDados);

		const [resultado] = await db.listar(DEFAULT_ITEM_ATUALIZAR.id);

		deepEqual(resultado, expected);
	});
});
