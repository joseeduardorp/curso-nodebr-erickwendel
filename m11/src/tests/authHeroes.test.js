const assert = require('node:assert');

const Context = require('../db/strategies/base/contextStrategy');
const Postgres = require('../db/strategies/postgres/postgres');
const UsuarioSchema = require('../db/strategies/postgres/schemas/usarioSchema');

const api = require('../api');

let app = {};
const USER = {
	username: 'joseeduardo',
	password: '123',
};
const USER_DB = {
	username: USER.username.toLowerCase(),
	password: '$2b$04$HyHJGWHyNSn/ugJO408ov.h6hD/ummOT5PKIa/u.DzOKab2lV3ll6',
};

describe('Auth test suite', function () {
	this.beforeAll(async () => {
		app = await api;

		const connection = await Postgres.connect();
		const model = await Postgres.defineModel(connection, UsuarioSchema);
		const context = new Context(new Postgres(connection, model));
		await context.update(null, USER_DB, true);
	});

	it('Deve obter um token', async () => {
		const result = await app.inject({
			method: 'POST',
			url: '/login',
			payload: USER,
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
