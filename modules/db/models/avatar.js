module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Avatar', {
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true
		},
		url: {
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