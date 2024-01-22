const assert = require('node:assert');

const PasswordHelper = require('../helpers/passwordHelper');

const SENHA = 'umasenhadificil';
const HASH = '$2b$04$9MQ/1cb6lYYgJ0qRdjqYQeBwxzC9wwkfi7oAoCIqHjOcQ2N7hx8B2';

describe('UserHelper test suite', function () {
	it('Deve gerar um hash a partir de uma senha', async () => {
		const result = await PasswordHelper.hashPassword(SENHA);

		assert.ok(result.length > 10);
	});

	it('Deve validar uma senha a partir do hash', async () => {
		const result = await PasswordHelper.comparePassword(SENHA, HASH);

		assert.ok(result);
	});
});
