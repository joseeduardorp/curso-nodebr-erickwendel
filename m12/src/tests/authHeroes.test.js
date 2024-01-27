const assert = require('node:assert');

const Context = require('../db/strategies/base/contextStrategy');
const Postgres = require('../db/strategies/postgres/postgres');
const UsuarioSchema = require('../db/strategies/postgres/schemas/usarioSchema');

const api = require('../api');

let app = {};
const DEFAULT_USER = {
	username: 'user',
	password: '1234',
};
const DEFAULT_USER_DB = {
	username: DEFAULT_USER.username.toLowerCase(),
	password: '$2b$04$BATWT0GIQGJmWe6oXwc9AuDWG5CdR8HSc1O9AUHmN5OJM5i6OHGke',
};
const MOCK_USUARIO_CADASTRAR = {
	username: `user-${Date.now()}`,
	password: 'novasenha',
};

describe('Auth test suite', function () {
	this.timeout(10000);

	this.beforeAll(async () => {
		app = await api;

		const connection = await Postgres.connect();
		const model = await Postgres.defineModel(connection, UsuarioSchema);
		const context = new Context(new Postgres(connection, model));
		await context.update(null, DEFAULT_USER_DB, true);
	});

	it('Deve criar um novo usuário', async () => {
		const result = await app.inject({
			method: 'POST',
			url: '/signup',
			payload: MOCK_USUARIO_CADASTRAR,
		});

		const statusCode = result.statusCode;
		const { message } = JSON.parse(result.payload);

		assert.ok(statusCode === 200);
		assert.deepEqual(message, 'Usuário criado com sucesso!');
	});

	it('Deve retornar um erro ao tentar cadastrar username já existente', async () => {
		const result = await app.inject({
			method: 'POST',
			url: '/signup',
			payload: MOCK_USUARIO_CADASTRAR,
		});

		const statusCode = result.statusCode;
		const dados = JSON.parse(result.payload);

		const exptected = {
			error: 'Bad Request',
			message: 'Bad Request',
			statusCode: 400,
		};

		assert.ok(statusCode === 400);
		assert.deepEqual(dados, exptected);
	});

	it('Deve obter um token', async () => {
		const result = await app.inject({
			method: 'POST',
			url: '/login',
			payload: DEFAULT_USER,
		});

		const statusCode = result.statusCode;
		const dados = JSON.parse(result.payload);

		assert.deepEqual(statusCode, 200);
		assert.ok(dados.token.length > 10);
	});

	it("Deve retornar 'não autorizado' ao tentar entrar com um login errado", async () => {
		const result = await app.inject({
			method: 'POST',
			url: '/login',
			payload: {
				username: 'joseeduardo',
				password: 'senhaerrada',
			},
		});

		const statusCode = result.statusCode;
		const dados = JSON.parse(result.payload);

		assert.deepEqual(statusCode, 401);
		assert.deepEqual(dados.error, 'Unauthorized');
	});
});
