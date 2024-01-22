// npm i jsonwebtoken

const Joi = require('joi');
const Boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');

const BaseRoute = require('./base/baseRoute');
const PasswordHelper = require('../helpers/passwordHelper');

const failAction = (request, response, error) => {
	throw error;
};

const user = {
	username: 'joseeduardo',
	password: 'senha',
};

class AuthRoutes extends BaseRoute {
	constructor(secret, db) {
		super();
		this.secret = secret;
		this.db = db;
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

				const [usuario] = await this.db.read({
					username: username.toLowerCase(),
				});

				if (!usuario) {
					return Boom.unauthorized('O usuário informado não existe!');
				}

				const match = await PasswordHelper.comparePassword(
					password,
					usuario.password
				);

				if (!match) {
					return Boom.unauthorized('Usuário ou senha inválidos!');
				}

				const token = jwt.sign(
					{
						username,
						id: usuario.id,
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
