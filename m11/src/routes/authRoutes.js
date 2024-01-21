// npm i jsonwebtoken

const Joi = require('joi');
const Boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');

const BaseRoute = require('./base/baseRoute');

const failAction = (request, response, error) => {
	throw error;
};

const user = {
	username: 'joseeduardo',
	password: 'senha',
};

class AuthRoutes extends BaseRoute {
	constructor(secret) {
		super();
		this.secret = secret;
	}

	login() {
		return {
			path: '/login',
			method: 'POST',
			options: {
				auth: false,
				tags: ['api'],
				description: 'Obter token',
				notes: 'Faz login com user e senha do banco',
				validate: {
					failAction,
					payload: Joi.object({
						username: Joi.string().required(),
						password: Joi.string().required(),
					}),
				},
			},
			handler: async (request, response) => {
				const { username, password } = request.payload;

				if (
					username.toLowerCase() !== user.username.toLowerCase() ||
					password !== user.password
				) {
					return Boom.unauthorized();
				}

				const token = jwt.sign(
					{
						username,
						id: 1,
					},
					this.secret
				);

				return {
					token,
				};
			},
		};
	}
}

module.exports = AuthRoutes;
