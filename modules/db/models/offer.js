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
				isDate: true
			}
		},
		endAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: emptyDate,
			validate: {
				isDate: true
			}
		}
		// template - foreign key from OfferTemplate
		// place - foreign key from Place
	}, {
		timestamps: true, // add createdAt, updatedAt
		paranoid: true, // add deletedAt instead of real deleting
	});
};