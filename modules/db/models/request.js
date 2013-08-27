var _ = $require('/libs/underscore');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Request', {
		id: {
			type: DataTypes.BIGINT,
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
		// author - foreign key from Users
		// place - foreign key from Places
		// recipe - foreign key from Recipes
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