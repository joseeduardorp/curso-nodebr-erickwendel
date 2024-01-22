const { DataTypes } = require('sequelize');

const UsuarioSchema = {
	name: 'usuarios',
	schema: {
		id: {
			type: DataTypes.INTEGER,
			required: true,
			primaryKey: true,
			autoIncrement: true,
		},
		username: {
			type: DataTypes.STRING,
			unique: true,
			required: true,
		},
		password: {
			type: DataTypes.STRING,
			required: true,
		},
	},
	options: {
		tableName: 'TB_USUARIOS',
		freezeTableName: false,
		timestamps: false,
	},
};

module.exports = UsuarioSchema;
