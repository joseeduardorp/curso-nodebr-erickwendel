// npm i @hapi/hapi
// npm i hapi-swagger @hapi/inert @hapi/vision

const Hapi = require('@hapi/hapi');
const HapiSwagger = require('hapi-swagger');
const Vision = require('@hapi/vision');
const Inert = require('@hapi/inert');

const MongoDB = require('./db/strategies/mongodb/mongodb');
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema');
const Context = require('./db/strategies/base/contextStrategy');
const HeroRoutes = require('./routes/heroRoutes');

const app = new Hapi.Server({
	port: 5000,
});

function mapRoutes(instance, methods) {
	return methods.map((method) => instance[method]());
}

async function main() {
	const connection = await MongoDB.connect();
	const context = new Context(new MongoDB(connection, HeroiSchema));

	const swaggerOptions = {
		info: {
			title: 'API Herois - #CursoNodeBR',
			version: 'v1.0',
		},
	};
	await app.register([
		Vision,
		Inert,
		{ plugin: HapiSwagger, options: swaggerOptions },
	]);

	app.route(mapRoutes(new HeroRoutes(context), HeroRoutes.methods()));

	await app.start();

	console.log(`Server is running at http://localhost:${app.info.port}`);

	return app;
}

module.exports = main();
