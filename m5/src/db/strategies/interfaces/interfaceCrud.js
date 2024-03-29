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

module.exports = ICrud;
