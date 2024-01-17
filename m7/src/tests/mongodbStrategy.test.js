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

describe('MongoDB Strategy', function () {
	this.timeout(Infinity);

	this.beforeAll(async () => {
		await context.connect();
		await context.create(MOCK_HEROI_DEFAULT);
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
});
