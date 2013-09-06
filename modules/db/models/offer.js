module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Offer', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		startedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: 0,
			validate: {
				isWithEnd: function(value) {
					if(value !== 0) {
						if((this.endAt === 0) || (value <= this.endAt)) {
							throw new Error('Started time must be set with end time!');
						}
					}
				}
			}
		},
		endAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: 0,
			validate: {
				isAfterStart: function(value) {
					if(value !== 0) {
						if((this.startedAt === 0) || (value <= this.startedAt)) {
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