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
			defaultValue: emptyDate,
			validate: {
				isWithEnd: function(value) {
					if(value !== emptyDate) {
						if((this.endAt === emptyDate) || (value <= this.endAt)) {
							throw new Error('Started time must be set with end time!');
						}
					}
				}
			}
		},
		endAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: emptyDate,
			validate: {
				isAfterStart: function(value) {
					if(value !== emptyDate) {
						if((this.startedAt === emptyDate) || (value <= this.startedAt)) {
							throw new Error('End time must be after started time!');
						}
					}
				}
			}
		}
		// template - foreign key from OfferTemplate
		// place - foreign key from Place
	}, {
		timestamps: true, // add createdAt, updatedAt
		paranoid: true, // add deletedAt instead of real deleting
	});
};