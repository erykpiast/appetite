var emptyDate = new Date(0);

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Offer', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		startAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: emptyDate/*, // validation for dates doesn't work dates for some reason
			validate: {
				isWithEnd: function(value) {
					if(value !== emptyDate) {
						if((this.values.endAt === emptyDate) || (value >= this.values.endAt)) {
							throw new Error('Start time must be set with end time!');
						}
					}
				}
			}*/
		},
		endAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: emptyDate/*, // validation for dates doesn't work dates for some reason
			validate: {
				isAfterStart: function(value) {
					if(value !== emptyDate) {
						if((this.values.startAt === emptyDate) || (value <= this.values.startAt)) {
							throw new Error('End time must be after start time!');
						}
					}
				}
			}*/
		}
		// template - foreign key from OfferTemplate
		// place - foreign key from Place
	}, {
		timestamps: true, // add createdAt, updatedAt
		paranoid: true, // add deletedAt instead of real deleting
	});
};