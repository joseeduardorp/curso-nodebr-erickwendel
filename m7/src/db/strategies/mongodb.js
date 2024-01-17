const Mongoose = require('mongoose');

const ICrud = require('./interfaces/interfaceCrud');

const STATUS = {
	0: 'Disconectado',
	1: 'Conectado',
	2: 'Conectando',
	3: 'Disconectnado',
};

// Strategy MongoDB
class MongoDB extends ICrud {
	constructor() {
		super();
		this._herois = null;
		this._connection = null;
	}

	async connect() {
		await Mongoose.connect(
			'mongodb://joseeduardo:minhasenha@localhost:27017/heroes'
		).catch((err) => {
			console.error('Falha na conexão!', err);
		});

		this._connection = Mongoose.connection;
		this._connection.once('open', () => console.log('Conectado com sucesso!'));
		this.defineModel();
	}

	async isConnected() {
		const state = STATUS[this._connection.readyState];

		if (state === 'Conectado' || state !== 'Conectando') return state;

		await new Promise((resolve) => setTimeout(resolve, 1000));

		return state;
	}

	defineModel() {
		const heroiSchema = new Mongoose.Schema({
			nome: {
				type: String,
				required: true,
			},
			poder: {
				type: String,
				required: true,
			},
			insertedAt: {
				type: Date,
				default: new Date(),
			},
		});

		this._herois = Mongoose.model('heroes', heroiSchema);
	}

	async create(item) {
		const data = await this._herois.create(item);

		return data;
	}

	async read(query, skip = 0, limit = 10) {
		const data = await this._herois.find(query).skip(skip).limit(limit);

		return data;
	}

	async update(id, data) {
		const result = await this._herois.updateOne({ _id: id }, { $set: data });

		return result;
	}

	async delete(id) {
		const result = await this._herois.deleteOne({ _id: id });

		return result;
	}
}

module.exports = MongoDB;
