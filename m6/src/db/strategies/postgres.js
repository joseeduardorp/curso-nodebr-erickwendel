const { Sequelize, DataTypes } = require('sequelize');

const ICrud = require('./interfaces/interfaceCrud');

// Strategy Postgres
class Postgres extends ICrud {
	constructor() {
		super();
		this.driver = null;
		this._herois = null;

		this._connect();
	}

	_connect() {
		this.driver = new Sequelize('heroes', 'joseeduardo', 'senha', {
			host: 'localhost',
			dialect: 'postgres',
			quoteIdentifiers: false,
			// operatorsAliases: false,
		});
	}

	async isConnected() {
		try {
			await this.driver.authenticate();

			return true;
		} catch (error) {
			console.error('Não foi possível conectar ao banco de dados', error);

			return false;
		}
	}

	async defineModel() {
		this._herois = this.driver.define(
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

	create(item) {
		console.log('O item foi salvo em Postgres');
	}
}

module.exports = Postgres;
