// npm i @hapi/hapi
const Hapi = require('@hapi/hapi');
const MongoDB = require('./db/strategies/mongodb/mongodb');
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema');
const Context = require('./db/strategies/base/contextStrategy');

const app = new Hapi.Server({
	port: 5000,
});

async function main() {
	const connection = await MongoDB.connect();
	const context = new Context(new MongoDB(connection, HeroiSchema));

	app.route([
		{
			path: '/herois',
			method: 'GET',
			handler: (request, head) => {
				return context.read();
			},
		},
		{
			path: '/',
			method: 'GET',
			handler: (request, head) => {
				return JSON.stringify({ message: 'Hello Hapi' });
			},
		},
	]);

	await app.start();

	console.log(`Server is running at http://localhost:${app.info.port}`);
}

main();
