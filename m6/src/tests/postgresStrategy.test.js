const assert = require('node:assert');
const Postgres = require('../db/strategies/postgres');
const Context = require('../db/strategies/base/contextStrategy');

const context = new Context(new Postgres());

describe('Postgres Strategy', function () {
	this.timeout(Infinity);

	it('PostgreSQL Connection', async () => {
		const result = await context.isConnected();

		assert.equal(result, true);
	});
});
