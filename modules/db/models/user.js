var auth = $require('/modules/auth');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('User', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		authService: {
			type: DataTypes.ENUM,
			values: auth.services,
			allowNull: false
		},
		serviceId: {
			type: DataTypes.STRING,
			allowNull: false
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