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

		this._herois = Mongoose.model('herois', heroiSchema);
	}

	async create(item) {
		const data = await this._herois.create(item);

		return data;
	}
}

module.exports = MongoDB;
