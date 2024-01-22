const { Sequelize, DataTypes } = require('sequelize');

const ICrud = require('../interfaces/interfaceCrud');

// Strategy Postgres
class Postgres extends ICrud {
	constructor(connection, schema) {
		super();
		this._connection = connection;
		this._schema = schema;
	}

	static async connect() {
		const connection = new Sequelize(process.env.POSTGRES_URL, {
			dialect: 'postgres',
			quoteIdentifiers: false,
			logging: false,
			ssl: process.env.SSL_DB,
			dialectOptions: {
				ssl: process.env.SSL_DB,
			},
			// operatorsAliases: false,
		});

		return connection;
	}

	async isConnected() {
		try {
			await this._connection.authenticate();

			return true;
		} catch (error) {
			console.error('Não foi possível conectar ao banco de dados', error);

			return false;
		}
	}

	static async defineModel(connection, schema) {
		const model = connection.define(schema.name, schema.schema, schema.options);

		await model.sync();

		return model;
	}

	async create(item) {
		const { dataValues } = await this._schema.create(item);

		return dataValues;
	}

	async read(query = {}) {
		const result = await this._schema.findAll({ where: query, raw: true });

		return result;
	}

	async update(id, data, upsert = false) {
		const fn = upsert ? 'upsert' : 'update';
		const success = await this._schema[fn](data, { where: { id: id } });

		return success;
	}

	async delete(id) {
		const query = id ? { id } : {};
		const success = await this._schema.destroy({ where: query });

		return success;
	}
}

module.exports = Postgres;
