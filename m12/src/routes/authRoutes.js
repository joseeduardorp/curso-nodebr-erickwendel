// npm i jsonwebtoken

const Joi = require('joi');
const Boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');

const BaseRoute = require('./base/baseRoute');
const PasswordHelper = require('../helpers/passwordHelper');

const failAction = (request, response, error) => {
	throw error;
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
				cors: true,
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

				const token = jwt.sign({ id: usuario.id, username }, this.secret);

				return {
					token,
				};
			},
		};
	}

	signup() {
		return {
			path: '/signup',
			method: 'POST',
			options: {
				cors: true,
				auth: false,
				tags: ['api'],
				description: 'Criar uma conta',
				notes: 'Cria uma conta com usuário e senha',
				validate: {
					failAction,
					payload: Joi.object({
						username: Joi.string().required(),
						password: Joi.string().required(),
					}),
				},
			},
			handler: async (request, response) => {
				try {
					const { username, password } = request.payload;

					const hashedPassword = await PasswordHelper.hashPassword(password);

					const result = await this.db.create({
						username,
						password: hashedPassword,
					});

					const token = jwt.sign({ id: result.id, username }, this.secret);

					return {
						message: 'Usuário criado com sucesso!',
						token,
					};
				} catch (error) {
					return Boom.badRequest();
				}
			},
		};
	}
}

module.exports = AuthRoutes;
