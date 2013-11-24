var auth = $require('/modules/auth');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('User', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		gender: {
			type: DataTypes.ENUM,
            values: [ 'male', 'female', 'unknown' ],
			allowNull: false,
			defaultValue: 'unknown'
		},
		site: {
			type: DataTypes.STRING, // URL (protocol + domain)
			allowNull: false,
			defaultValue: ''
		}
		// accessToken - foreign key from AccessToken
		// avatar - foreign key from Avatar
		// place - foreign key from Place
	}, {
		timestamps: true, // add createdAt, updatedAt
		paranoid: true, // add deletedAt instead of real deleting
		getterMethods: {
			fullName: function() {
				return [ this.firstName, this.lastName ].join(' ');
			}
		}
	});
};