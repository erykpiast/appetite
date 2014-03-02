module.exports = function(sequelize, DataTypes) {
	return sequelize.define('UserRating', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		type: {
			type: DataTypes.ENUM,
            values: [ 'positive', 'negative', 'unknown' ],
			allowNull: false,
			defaultValue: 'unknown'
		}
		// author - foreign key from User
		// target - foreign key from User
	}, {
		timestamps: true, // add createdAt, updatedAt
		paranoid: true, // add deletedAt instead of real deleting
	});
};