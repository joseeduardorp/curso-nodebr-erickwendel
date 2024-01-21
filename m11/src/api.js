// npm i @hapi/hapi
// npm i hapi-swagger @hapi/inert @hapi/vision
// npm i hapi-auth-jwt2

// npm i bcrypt

const Hapi = require('@hapi/hapi');
const HapiSwagger = require('hapi-swagger');
const Vision = require('@hapi/vision');
const Inert = require('@hapi/inert');
const HapiJWT = require('hapi-auth-jwt2');

const MongoDB = require('./db/strategies/mongodb/mongodb');
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema');
const Postgres = require('./db/strategies/postgres/postgres');
const UsuarioSchema = require('./db/strategies/postgres/schemas/usarioSchema');

const Context = require('./db/strategies/base/contextStrategy');

const HeroRoutes = require('./routes/heroRoutes');
const AuthRoutes = require('./routes/authRoutes');

const app = new Hapi.Server({
	port: 5000,
});
const JWT_SECRET = 'S3cRe7-K&i';

function mapRoutes(instance, methods) {
	return methods.map((method) => instance[method]());
}

async function main() {
	const mongoConnection = await MongoDB.connect();
	const mongoContext = new Context(new MongoDB(mongoConnection, HeroiSchema));

	const postgresConnection = await Postgres.connect();
	const model = await Postgres.defineModel(postgresConnection, UsuarioSchema);
	const postgresContext = new Context(new Postgres(postgresConnection, model));

	const swaggerOptions = {
		info: {
			title: 'API Herois - #CursoNodeBR',
			version: 'v1.0',
		},
	};
	await app.register([
		HapiJWT,
		Vision,
		Inert,
		{ plugin: HapiSwagger, options: swaggerOptions },
	]);

	app.auth.strategy('jwt', 'jwt', {
		key: JWT_SECRET,
		// options: {
		// 	expiresIn: 20
		// },
		validate: async (dado, request) => {
			const [result] = await postgresContext.read({
				username: dado.username.toLowerCase(),
			});

			if (!result) {
				return {
					isValid: false,
				};
			}

			return {
				isValid: true,
			};
		},
	});

	app.auth.default('jwt');

	app.route([
		...mapRoutes(new HeroRoutes(mongoContext), HeroRoutes.methods()),
		...mapRoutes(
			new AuthRoutes(JWT_SECRET, postgresContext),
			AuthRoutes.methods()
		),
	]);

	await app.start();

	console.log(`Server is running at http://localhost:${app.info.port}`);

	return app;
}

module.exports = main();
