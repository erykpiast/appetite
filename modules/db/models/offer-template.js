var _ = $require('/libs/underscore');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('OfferTemplate', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false
		}
		// author - foreign key from User
		// place - foreign key from Place
		// recipe - foreign key from Recipe
	}, {
		timestamps: true, // add createdAt, updatedAt
		paranoid: true, // add deletedAt instead of real deleting
		getterMethods: {
			summary: function() {
				return _.prune(this.description, 255, '...');
			}
		}
	});
};