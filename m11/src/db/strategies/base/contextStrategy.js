const ICrud = require('../interfaces/interfaceCrud');

// Context
class ContextStrategy extends ICrud {
	constructor(strategy) {
		super();
		this._database = strategy;
	}

	create(item) {
		return this._database.create(item);
	}

	read(query, skip, limit) {
		return this._database.read(query, skip, limit);
	}

	update(id, data, upsert) {
		return this._database.update(id, data, upsert);
	}

	delete(id) {
		return this._database.delete(id);
	}

	isConnected() {
		return this._database.isConnected();
	}

	static connect() {
		return this._database.connect();
	}
}

module.exports = ContextStrategy;
