module.exports = function(sequelize, DataTypes) {
	return sequelize.define('RequestResponse', {
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
		// request - foreign key from ActualRequest
		// user - foreign key from User
	}, {
		timestamps: true, // add createdAt, updatedAt
		paranoid: true, // add deletedAt instead of real deleting
	});
};