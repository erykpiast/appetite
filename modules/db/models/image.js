module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Image', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		filename: {
		    type: DataTypes.STRING, // guessing...
			allowNull: false
		},
		originalUrl: {
			type: DataTypes.STRING(1024), // guessing...
			allowNull: false
		}
		// author - foreign key from User
		// createdAt - auto
	}, {
		timestamps: true, // add createdAt, updatedAt
		paranoid: true, // add deletedAt instead of real deleting
	});
};