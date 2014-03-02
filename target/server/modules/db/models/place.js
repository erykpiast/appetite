var _format = (function() {
		var units = [ '°', '\'', '"' ];

		return function (seconds) {
			var degrees = MathJs.floor(seconds / (60 * 60));
			seconds -= degrees * (60 * 60);

			var minutes = MathJs.floor(seconds / 60);
			seconds -= minutes * 60;

			return [ degrees, minutes, seconds ].map(function(el, index) {
				return el + units[index];
			}).join(' ');
		};
	})();

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Place', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		serviceId: {
			type: DataTypes.STRING,
			allowNull: false
		},
		name: {
			type: DataTypes.STRING(511), // guessing...
			allowNull: false
		}
		// author - foreign key from User
	}, {
		timestamps: true, // add createdAt, updatedAt
		paranoid: true // add deletedAt instead of real deleting
	});
};