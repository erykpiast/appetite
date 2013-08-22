var _format = (function() {
		var Math = $require('mathjs'),
			units = [ '°', '\'', '"' ];

		return function (seconds) {
			var degrees = Math.floor(seconds / (60 * 60));
			seconds -= degrees * (60 * 60);

			var minutes = Math.floor(seconds / 60);
			seconds -= minutes * 60;

			return [ degrees, minutes, seconds ].map(function(el, index) {
				return el + units[index];
			}).join(' ');
		};
	})();

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Image', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING(511), // guessing...
			allowNull: false
		},
		latitude: {
			type: DataTypes.BIGINT,
			allowNull: true,
			defaultValue: null,
			validate: { min: -(90 * 60 * 60), max: (90 * 60 * 60) }
		},
		longitude: {
			type: DataTypes.BIGINT,
			allowNull: true,
			defaultValue: null,
			validate: { min: -(180 * 60 * 60), max: (180 * 60 * 60) }
		}
		// author - foreign key from User
	}, {
		timestamps: true, // add createdAt, updatedAt
		paranoid: true, // add deletedAt instead of real deleting
		getterMethods: {
			latitudeFormatted: function() {
				return _format(this.latitude);
			},
			longitudeFormatted: function() {
				return _format(this.longitude);
			},
		},
		validate: {
			bothCoordsOrNone: function() {
				if ((this.latitude === null) === (this.longitude === null)) {
					throw new Error('Require either both latitude and longitude or neither')
				}
			}
		}
	});
};