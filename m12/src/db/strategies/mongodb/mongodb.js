const Mongoose = require('mongoose');

const ICrud = require('../interfaces/interfaceCrud');

const STATUS = {
	0: 'Disconectado',
	1: 'Conectado',
	2: 'Conectando',
	3: 'Disconectnado',
};

// Strategy MongoDB
class MongoDB extends ICrud {
	constructor(connection, schema) {
		super();
		this._connection = connection;
		this._schema = schema;
	}

	static async connect() {
		await Mongoose.connect(process.env.MONGODB_URL).catch((err) => {
			console.error('Falha na conexão!', err);
		});

		const connection = Mongoose.connection;
		connection.once('open', () => console.log('Conectado com sucesso!'));

		return connection;
	}

	async isConnected() {
		const state = STATUS[this._connection.readyState];

		if (state === 'Conectado' || state !== 'Conectando') return state;

		await new Promise((resolve) => setTimeout(resolve, 1000));

		return state;
	}

	async create(item) {
		const data = await this._schema.create(item);

		return data;
	}

	async read(query, skip = 0, limit = 10) {
		const data = await this._schema.find(query).skip(skip).limit(limit);

		return data;
	}

	async update(id, data) {
		const result = await this._schema.updateOne({ _id: id }, { $set: data });

		return result;
	}

	async delete(id) {
		const result = await this._schema.deleteOne({ _id: id });

		return result;
	}
}

module.exports = MongoDB;
