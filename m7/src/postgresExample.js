// npm i sequelize pg pg-hstore
const { Sequelize, DataTypes } = require('sequelize');
const driver = new Sequelize('heroes', 'joseeduardo', 'senha', {
	host: 'localhost',
	dialect: 'postgres',
	quoteIdentifiers: false,
	operatorsAliases: false,
});

async function main() {
	const Herois = driver.define(
		'herois',
		{
			id: {
				type: DataTypes.INTEGER,
				required: true,
				primaryKey: true,
				autoIncrement: true,
				// allowNull: false,
				// autoIncrementIdentity: true,
			},
			nome: {
				type: DataTypes.STRING,
				required: true,
				// allowNull: false,
			},
			poder: {
				type: DataTypes.STRING,
				required: true,
				// allowNull: false,
			},
		},
		{
			tableName: 'TB_HEROIS',
			freezeTableName: false,
			timestamps: false,
		}
	);

	await Herois.sync();
	// await Herois.create({
	// 	nome: 'Lanterna Verde',
	// 	poder: 'Anel',
	// });

	const result = await Herois.findAll({ raw: true, attributes: ['nome'] });
	console.log('result', result);
}

main();
