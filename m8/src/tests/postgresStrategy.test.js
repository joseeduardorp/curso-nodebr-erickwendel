const assert = require('node:assert');
const Postgres = require('../db/strategies/postgres/postgres');
const HeroiSchema = require('../db/strategies/postgres/schemas/heroisSchema');
const Context = require('../db/strategies/base/contextStrategy');

const MOCK_HEROI_CADASTRAR = {
	nome: 'Gavião Negro',
	poder: 'Flechas',
};
const MOCK_HEROI_ATUALIZAR = {
	nome: 'Batman',
	poder: 'Dinheiro',
};

let context = {};

describe('Postgres Strategy', function () {
	this.timeout(Infinity);

	this.beforeAll(async () => {
		const connection = await Postgres.connect();
		const model = await Postgres.defineModel(connection, HeroiSchema);
		context = new Context(new Postgres(connection, model));

		await context.delete();
		await context.create(MOCK_HEROI_ATUALIZAR);
	});

	it('PostgreSQL Connection', async () => {
		const result = await context.isConnected();

		assert.equal(result, true);
	});

	it('Cadastrar herói', async () => {
		const result = await context.create(MOCK_HEROI_CADASTRAR);
		delete result.id;

		assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
	});

	it('Listar herói', async () => {
		const [result] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome });
		delete result.id;

		assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
	});

	it('Atualizar herói', async () => {
		const [itemAtualizar] = await context.read({
			nome: MOCK_HEROI_ATUALIZAR.nome,
		});
		const novosDados = {
			...MOCK_HEROI_ATUALIZAR,
			nome: 'Mulher Maravilha',
		};

		const [result] = await context.update(itemAtualizar.id, novosDados);
		const [itemAtualizado] = await context.read({ id: itemAtualizar.id });

		assert.deepEqual(result, 1);
		assert.deepEqual(itemAtualizado.nome, novosDados.nome);
	});

	it('Remover herói', async () => {
		const [item] = await context.read({});
		const result = await context.delete(item.id);

		assert(result, 1);
	});
});
