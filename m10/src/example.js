/**
 * Classes de Exemplo
 */

class NotImplementedException extends Error {
	constructor() {
		super('Not Implemented Exception');
	}
}

// CRUD Interface
class ICrud {
	create(item) {
		throw new NotImplementedException();
	}

	read(query) {
		throw new NotImplementedException();
	}

	update(id, data) {
		throw new NotImplementedException();
	}

	delete(id) {
		throw new NotImplementedException();
	}
}

// Strategy MongoDB
class MongoDB extends ICrud {
	constructor() {
		super();
	}

	create(item) {
		console.log('O item foi salvo em MongoDB');
	}
}

// Strategy Postgres
class Postgres extends ICrud {
	constructor() {
		super();
	}

	create(item) {
		console.log('O item foi salvo em Postgres');
	}
}

// Context
class ContextStrategy {
	constructor(strategy) {
		this._database = strategy;
	}

	create(item) {
		return this._database.create(item);
	}

	read(query) {
		return this._database.read(query);
	}

	udpate(id, data) {
		return this._database.update(id, data);
	}

	delete(id) {
		return this._database.delete(id);
	}
}

const contextMongo = new ContextStrategy(new MongoDB());
contextMongo.create();

const contextPostgres = new ContextStrategy(new Postgres());
contextPostgres.create();
