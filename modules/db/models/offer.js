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
		},
		type: {
			type: DataTypes.ENUM,
            values: [ 'offer', 'request', 'unknown' ],
			allowNull: false,
			defaultValue: 'unknown'
		}
		// template - foreign key from OfferTemplate
		// place - foreign key from Place
	}, {
		timestamps: true, // add createdAt, updatedAt
		paranoid: true, // add deletedAt instead of real deleting,
		getterMethods: {
			started: function() {
				return ((new Date(this.startAt)).getTime() !== 0);
			},
			ended: function() {
				return (this.started && ((new Date(this.endAt)).getTime() < Date.now()));
			}
		}
	});
};