const Joi = require('joi');
const Boom = require('@hapi/boom');

const BaseRoute = require('./base/baseRoute');

const failAction = (request, response, error) => {
	throw error;
};

class HeroRoutes extends BaseRoute {
	constructor(db) {
		super();
		this.db = db;
	}

	list() {
		return {
			path: '/herois',
			method: 'GET',
			options: {
				tags: ['api'],
				description: 'Deve listar heróis',
				notes: 'Pode páginar resultados e filtrar por nome',
				validate: {
					failAction,
					query: Joi.object({
						skip: Joi.number().integer().default(0),
						limit: Joi.number().integer().default(10),
						nome: Joi.string().min(3).max(100),
					}),
				},
			},
			handler: (request, headers) => {
				try {
					const { skip, limit, nome } = request.query;

					let query = nome ? { nome: { $regex: `.*${nome}*.` } } : {};

					return this.db.read(query, skip, limit);
				} catch (error) {
					// console.error('Ocorreu um erro', error);
					return Boom.internal();
				}
			},
		};
	}

	create() {
		return {
			path: '/herois',
			method: 'POST',
			options: {
				tags: ['api'],
				description: 'Deve cadastrar heróis',
				notes: 'Pode cadastrar heróis por nome e poder',
				validate: {
					failAction,
					payload: Joi.object({
						nome: Joi.string().required().min(3).max(100),
						poder: Joi.string().required().min(2).max(100),
					}),
				},
			},
			handler: async (request, response) => {
				try {
					const { nome, poder } = request.payload;
					const result = await this.db.create({ nome, poder });

					return {
						message: 'Herói cadastrado com sucesso!',
						_id: result._id,
					};
				} catch (error) {
					// console.error('Ocorreu um erro', error);
					return Boom.internal();
				}
			},
		};
	}

	update() {
		return {
			path: '/herois/{id}',
			method: 'PATCH',
			options: {
				tags: ['api'],
				description: 'Deve atualizar heróis pelo id',
				notes: 'Pode atualizar qualquer campo do herói',
				validate: {
					params: Joi.object({
						id: Joi.string().required(),
					}),
					payload: Joi.object({
						nome: Joi.string().min(3).max(100),
						poder: Joi.string().min(2).max(100),
					}),
				},
			},
			handler: async (request, response) => {
				try {
					const { id } = request.params;
					const payload = request.payload;

					const dadosString = JSON.stringify(payload);
					const dados = JSON.parse(dadosString);

					const result = await this.db.update(id, dados);

					if (result.modifiedCount !== 1) {
						return Boom.preconditionFailed(
							'ID não encontrado no banco de dados'
						);
					}

					return {
						message: 'Herói atualizado com sucesso!',
					};
				} catch (error) {
					// console.error('Ocorreu um erro', error);
					return Boom.internal();
				}
			},
		};
	}

	delete() {
		return {
			path: '/herois/{id}',
			method: 'DELETE',
			options: {
				tags: ['api'],
				description: 'Deve remover heróis pelo id',
				notes: 'Pode remover um herói',
				validate: {
					failAction,
					params: Joi.object({
						id: Joi.string().required(),
					}),
				},
			},
			handler: async (request, response) => {
				try {
					const { id } = request.params;

					const result = await this.db.delete(id);

					if (result.deletedCount !== 1) {
						return Boom.preconditionFailed(
							'ID não encontrado no banco de dados'
						);
					}

					return {
						message: 'Herói removido com sucesso!',
					};
				} catch (error) {
					// console.error('Ocorreu um erro', error);
					return Boom.internal();
				}
			},
		};
	}
}

module.exports = HeroRoutes;
