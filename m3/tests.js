const assert = require('assert');
const nock = require('nock');

const { obterPessoas } = require('./service');

describe('Star Wars Tests', () => {
	beforeEach(() => {
		const response = {
			count: 1,
			next: null,
			previous: null,
			results: [
				{
					name: 'R2-D2',
					height: '96',
					mass: '32',
					hair_color: 'n/a',
					skin_color: 'white, blue',
					eye_color: 'red',
					birth_year: '33BBY',
					gender: 'n/a',
					homeworld: 'https://swapi.dev/api/planets/8/',
					films: [
						'https://swapi.dev/api/films/1/',
						'https://swapi.dev/api/films/2/',
						'https://swapi.dev/api/films/3/',
						'https://swapi.dev/api/films/4/',
						'https://swapi.dev/api/films/5/',
						'https://swapi.dev/api/films/6/',
					],
					species: ['https://swapi.dev/api/species/2/'],
					vehicles: [],
					starships: [],
					created: '2014-12-10T15:11:50.376000Z',
					edited: '2014-12-20T21:17:50.311000Z',
					url: 'https://swapi.dev/api/people/3/',
				},
			],
		};

		nock('https://swapi.dev/api/people')
			.get('/?search=r2-d2')
			.reply(200, response);
	});

	it('deve buscar o r2-d2 com o formato correto', async () => {
		const expected = [{ nome: 'R2-D2', peso: '32' }];
		const nomeBase = 'r2-d2';

		const resultado = await obterPessoas(nomeBase);
		assert.deepEqual(resultado, expected);
	});
});
