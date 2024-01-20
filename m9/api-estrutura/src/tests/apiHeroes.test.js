const assert = require('assert');
const api = require('../api');

let app = {};

const MOCK_HEROI_CADASTRAR = {
	nome: 'Batman',
	poder: 'Dinheiro',
};
const MOCK_HEROI_INICIAL = {
	nome: 'Gavião Negro',
	poder: 'A mira',
};
let MOCK_ID = null;

describe.only('Suite de testes da API Heroes', function () {
	this.beforeAll(async () => {
		app = await api;

		const result = await app.inject({
			method: 'POST',
			url: '/herois',
			payload: MOCK_HEROI_INICIAL,
		});
		const dados = JSON.parse(result.payload);
		MOCK_ID = dados._id;
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

	it('Listar heróis, deve filtrar um item - /herois', async () => {
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

	it('Cadastrar heróis, deve cadastrar um herói - /herois', async () => {
		const result = await app.inject({
			method: 'POST',
			url: '/herois',
			payload: MOCK_HEROI_CADASTRAR,
		});

		const statusCode = result.statusCode;
		const { message, _id } = JSON.parse(result.payload);

		assert.ok(statusCode === 200);
		assert.deepEqual(message, 'Herói cadastrado com sucesso!');
		assert.notStrictEqual(_id, undefined);
	});

	it('Atualizar heróis, deve atualizar um herói - /herois/:id', async () => {
		const heroi_id = MOCK_ID;
		const novosDados = {
			poder: 'Super Mira',
		};

		const result = await app.inject({
			method: 'PATCH',
			url: `/herois/${heroi_id}`,
			payload: novosDados,
		});

		const statusCode = result.statusCode;
		const { message } = JSON.parse(result.payload);

		assert.ok(statusCode === 200);
		assert.deepEqual(message, 'Herói atualizado com sucesso!');
	});

	it('Atualizar heróis, deve retornar um erro ao tentar atualizar - /herois/:id', async () => {
		const heroi_id = '65a9b187c3b2a665405dd55d';
		const novosDados = {
			poder: 'Super Mira',
		};

		const result = await app.inject({
			method: 'PATCH',
			url: `/herois/${heroi_id}`,
			payload: novosDados,
		});

		const statusCode = result.statusCode;
		const { message } = JSON.parse(result.payload);

		assert.ok(statusCode === 200);
		assert.deepEqual(message, 'Não foi possível atualizar!');
	});
});
