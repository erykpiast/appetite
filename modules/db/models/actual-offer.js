module.exports = function(sequelize, DataTypes) {
	return sequelize.define('ActualOffer', {
		id: {
			type: DataTypes.BIGINT,
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
		// place - foreign key from Place
	}, {
		timestamps: true, // add createdAt, updatedAt
		paranoid: true, // add deletedAt instead of real deleting
	});
};