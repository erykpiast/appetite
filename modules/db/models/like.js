module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Like', {
		// author - foreign key from User
		// offer - foreign key from Offer
		// createdAt - auto
	}, {
		timestamps: true, // add createdAt, updatedAt
		paranoid: true, // add deletedAt instead of real deleting
	});
};