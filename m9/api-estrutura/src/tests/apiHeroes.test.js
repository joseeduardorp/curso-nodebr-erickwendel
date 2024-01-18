const assert = require('assert');
const api = require('../api');

let app = {};

describe('Suite de testes da API Heroes', function () {
	this.beforeAll(async () => {
		app = await api;
	});

	it('Listar heróis, deve retornar todos os heróis - /herois', async () => {
		const result = await app.inject({
			method: 'GET',
			url: '/herois?skip=0&limit=0',
		});

		const statusCode = result.statusCode;
		const dados = JSON.parse(result.payload);

		assert.deepEqual(statusCode, 200);
		assert.ok(Array.isArray(dados));
	});

	it('Listar heróis, deve retornar apenas 3 registros - /herois', async () => {
		const TAMANHO_LIMITE = 3;
		const result = await app.inject({
			method: 'GET',
			url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`,
		});

		const statusCode = result.statusCode;
		const dados = JSON.parse(result.payload);

		assert.deepEqual(statusCode, 200);
		assert.ok(dados.length === TAMANHO_LIMITE);
	});

	it('Listar heróis, deve retornar um erro - /herois', async () => {
		const TAMANHO_LIMITE = 'tipo_invalido';
		const ERROR_RESULT = {
			statusCode: 400,
			error: 'Bad Request',
			message: '"limit" must be a number',
			validation: {
				source: 'query',
				keys: ['limit'],
			},
		};

		const result = await app.inject({
			method: 'GET',
			url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`,
		});

		const statusCode = result.statusCode;
		const payload = JSON.parse(result.payload);

		assert.deepEqual(statusCode, ERROR_RESULT.statusCode);
		assert.deepEqual(payload, ERROR_RESULT);
	});

	it('Listar heróis, deve filtrar um item - Listar heróis', async () => {
		const TAMANHO_LIMITE = 1000;
		const NAME = 'Aquaman-1705527842418';
		const result = await app.inject({
			method: 'GET',
			url: `/herois?skip=0&limit=${TAMANHO_LIMITE}&nome=${NAME}`,
		});

		const statusCode = result.statusCode;
		const dados = JSON.parse(result.payload);

		assert.deepEqual(statusCode, 200);
		assert.deepEqual(dados[0].nome, NAME);
	});
});
