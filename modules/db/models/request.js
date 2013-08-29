module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Request', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		endAt: {
			type: DataTypes.DATE,
			allowNull: false,
			validate: {
				isAfterStart: function(value) {
					if(value <= this.createdAt) {
						throw new Error('End time must be after creation time!');
					}
				}
			}
		}
		// offer - foreign key from Offer
		// user - foreign key from User
		// place - foreign key from Place
	}, {
		timestamps: true, // add createdAt, updatedAt
		paranoid: true, // add deletedAt instead of real deleting
	});
};