module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Response', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		accepted: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
		// offer - foreign key from Offer
		// author - foreign key from User
	}, {
		timestamps: true, // add createdAt, updatedAt
		paranoid: true, // add deletedAt instead of real deleting
	});
};