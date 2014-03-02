var auth = $require('/modules/auth');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('AuthData', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		service: {
			type: DataTypes.ENUM,
			values: auth.services,
			allowNull: false
		},
		serviceId: { // id of user in service
			type: DataTypes.STRING,
			allowNull: false
		},
		accessToken: {
			type: DataTypes.STRING,
			allowNull: false
		},
		tokenExpires: {
		    type: DataTypes.DATE,
			allowNull: false
		}
		// user - foreign key from User
		// createdAt - auto
	}, {
		timestamps: true, // add createdAt, updatedAt
		paranoid: true // add deletedAt instead of real deleting
	});
};