const { deepEqual, ok } = require('assert');

const db = require('./database');

const DEFAULT_ITEM_CADASTRAR = {
	id: 1,
	nome: 'Homem de Ferro',
	poder: 'Super Força e Voo',
};

describe('Suite de manipulação de Heróis', () => {
	it('deve pesquisar um herói usando arquivos', async () => {
		const expected = DEFAULT_ITEM_CADASTRAR;
		const [resultado] = await db.listar(expected.id);

		deepEqual(resultado, expected);
	});
});
