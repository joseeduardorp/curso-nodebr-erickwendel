const assert = require('node:assert');
const MongoDB = require('../db/strategies/mongodb');
const Context = require('../db/strategies/base/contextStrategy');

const context = new Context(new MongoDB());

const MOCK_HEROI_CADASTRAR = {
	nome: 'Mulher Maravilha',
	poder: 'Laço',
};
const MOCK_HEROI_DEFAULT = {
	nome: `Aquaman-${Date.now()}`,
	poder: 'Respiração aquática',
};
const MOCK_HEROI_ATUALIZAR = {
	nome: `Flash-${Date.now()}`,
	poder: 'Velocidade',
};
let MOCK_HEROI_ID = null;

describe('MongoDB Strategy', function () {
	this.timeout(Infinity);

	this.beforeAll(async () => {
		await context.connect();
		await context.create(MOCK_HEROI_DEFAULT);
		const result = await context.create(MOCK_HEROI_ATUALIZAR);
		MOCK_HEROI_ID = result._id;
	});

	it('MongoDB connection', async () => {
		const result = await context.isConnected();
		const expected = 'Conectado';

		assert.deepEqual(result, expected);
	});

	it('Cadastrar herói', async () => {
		const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR);

		assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR);
	});

	it('Listar herói', async () => {
		const [{ nome, poder }] = await context.read({
			nome: MOCK_HEROI_DEFAULT.nome,
		});
		const result = { nome, poder };

		assert.deepEqual(result, MOCK_HEROI_DEFAULT);
	});

	it('Atualizar herói', async () => {
		const result = await context.update(MOCK_HEROI_ID, {
			nome: 'Savitar',
		});

		assert.deepEqual(result.modifiedCount, 1);
	});

	it('Remover herói', async () => {
		const result = await context.delete(MOCK_HEROI_ID);

		assert.deepEqual(result.deletedCount, 1);
	});
});
