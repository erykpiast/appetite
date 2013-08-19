module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Recipe', {
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true
		},
		url: {
			type: DataTypes.STRING(2048),
			allowNull: false
		}
		// author - foreign key from User
		// createdAt - auto
	}, {
		timestamps: true, // add createdAt, updatedAt
		paranoid: true, // add deletedAt instead of real deleting
		getterMethods: {
			domain: function() {
				return /(?:https?\:\/\/)?(?:w{3}\.)?([^\/\?\:]+)/.exec(this.url)[1];
			}
		}
	});
};