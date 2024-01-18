const Joi = require('joi');

const BaseRoute = require('./base/baseRoute');

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
				validate: {
					failAction: (request, response, error) => {
						throw error;
					},
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
					console.error('Ocorreu um erro', error);
					return 'Erro interno no servidor';
				}
			},
		};
	}
}

module.exports = HeroRoutes;
