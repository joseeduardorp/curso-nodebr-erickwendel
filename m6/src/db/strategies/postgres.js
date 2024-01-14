const { Sequelize, DataTypes } = require('sequelize');

const ICrud = require('./interfaces/interfaceCrud');

// Strategy Postgres
class Postgres extends ICrud {
	constructor() {
		super();
		this._driver = null;
		this._herois = null;
	}

	async connect() {
		this._driver = new Sequelize('heroes', 'joseeduardo', 'senha', {
			host: 'localhost',
			dialect: 'postgres',
			quoteIdentifiers: false,
			// operatorsAliases: false,
		});

		await this.defineModel();
	}

	async isConnected() {
		try {
			await this._driver.authenticate();

			return true;
		} catch (error) {
			console.error('Não foi possível conectar ao banco de dados', error);

			return false;
		}
	}

	async defineModel() {
		this._herois = this._driver.define(
			'herois',
			{
				id: {
					type: DataTypes.INTEGER,
					required: true,
					primaryKey: true,
					autoIncrement: true,
				},
				nome: {
					type: DataTypes.STRING,
					required: true,
				},
				poder: {
					type: DataTypes.STRING,
					required: true,
				},
			},
			{
				tableName: 'TB_HEROIS',
				freezeTableName: false,
				timestamps: false,
			}
		);

		await this._herois.sync();
	}

	async create(item) {
		const { dataValues } = await this._herois.create(item);

		return dataValues;
	}

	async read(query = {}) {
		const result = await this._herois.findAll({ where: query, raw: true });

		return result;
	}
}

module.exports = Postgres;
