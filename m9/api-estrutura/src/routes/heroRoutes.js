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
			handler: (request, headers) => {
				try {
					const { skip, limit, nome } = request.query;

					let query = {};
					if (nome) query.nome = nome;

					if (isNaN(skip)) throw Error('Tipo do parâmetro skip incorreto');

					if (isNaN(limit)) throw Error('Tipo do parâmetro limit incorreto');

					return this.db.read(query, parseInt(skip), parseInt(limit));
				} catch (error) {
					console.error('Ocorreu um erro', error);
					return 'Erro interno no servidor';
				}
			},
		};
	}
}

module.exports = HeroRoutes;
