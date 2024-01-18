const { DataTypes } = require('sequelize');

const HeroiSchema = {
	name: 'herois',
	schema: {
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
	options: {
		tableName: 'TB_HEROIS',
		freezeTableName: false,
		timestamps: false,
	},
};

module.exports = HeroiSchema;
