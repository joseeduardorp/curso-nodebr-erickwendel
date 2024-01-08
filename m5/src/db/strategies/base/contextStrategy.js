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

module.exports = ContextStrategy;
