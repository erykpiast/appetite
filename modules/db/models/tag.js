module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Tag', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		tag: {
		    type: DataTypes.STRING,
			allowNull: false
		}
		// author - foreign key from User
		// createdAt - auto
	}, {
		timestamps: true, // add createdAt, updatedAt
		paranoid: true, // add deletedAt instead of real deleting
	});
};