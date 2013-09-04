module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Offer', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		startedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null,
			validate: {
				isWithEnd: function(value) {
					if(value !== null) {
						if((this.endAt === null) || (value <= this.endAt)) {
							throw new Error('Started time must be set with end time!');
						}
					}
				}
			}
		},
		endAt: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null,
			validate: {
				isAfterStart: function(value) {
					if(value !== null) {
						if((this.startedAt === null) || (value <= this.startedAt)) {
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