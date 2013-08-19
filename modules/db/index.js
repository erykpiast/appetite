var Sequelize = require('sequelize'),
	_ = require('../../libs/underscore'),
	config = require('config').database;

// initialize database connection
var sequelize = new Sequelize(
	config.name,
	config.username,
	config.password,
	{
		define: {
			charset: 'utf8',
			collate: 'utf8_general_ci'
		}
	}
);


// load models
require('fs').readdir(__dirname + '/models', function(err, files) {
	files.filter(function(filename) { // all files except index.js
		return (/.js$/).test(filename) && (filename !== 'index.js');
	}).forEach(function(filename) {
		var modelname = _.capitalize(_.camelize(filename)).slice(0, -3); // actual-request -> ActualRequest
		module.exports[modelname] = sequelize.import(__dirname + '/models/' + filename);
	});

	// describe relationships
	(function(m) {
		m.ActualRequest.hasOne(m.Request, { foreignKeyConstraint: true });

		m.Request.hasOne(m.Recipe, { foreignKeyConstraint: true });
		m.Request.belongsTo(m.User, { foreignKeyConstraint: true });

		m.Request.hasMany(m.Image, { foreignKeyConstraint: true });
		m.Image.hasMany(m.Request, { foreignKeyConstraint: true });

		m.ActualRequest.hasMany(m.RequestResponse, { foreignKeyConstraint: true });
		m.RequestResponse.hasOne(m.ActualRequest, { foreignKeyConstraint: true });
		m.RequestResponse.belongsTo(m.User, { foreignKeyConstraint: true });

		m.ActualRequest.hasOne(m.Place, { foreignKeyConstraint: true });

		/* -- */

		m.ActualOffer.hasOne(m.Offer, { foreignKeyConstraint: true });

		m.Offer.hasOne(m.Recipe, { foreignKeyConstraint: true });
		m.Offer.belongsTo(m.User, { foreignKeyConstraint: true });

		m.Offer.hasMany(m.Image, { foreignKeyConstraint: true });
		m.Image.hasMany(m.Offer, { foreignKeyConstraint: true });

		m.ActualOffer.hasMany(m.OfferResponse, { foreignKeyConstraint: true });
		m.OfferResponse.hasOne(m.ActualOffer, { foreignKeyConstraint: true });
		m.OfferResponse.belongsTo(m.User, { foreignKeyConstraint: true });

		m.ActualOffer.hasOne(m.Place, { foreignKeyConstraint: true });

		/* -- */

		m.User.hasOne(m.Avatar, { foreignKeyConstraint: true });
		m.User.hasOne(m.Place, { foreignKeyConstraint: true });

		m.Like.belongsTo(m.User, { foreignKeyConstraint: true });
		m.Offer.hasMany(m.Like, { foreignKeyConstraint: true });

		/* -- */

		m.Recipe.belongsTo(m.User, { as: 'author', foreignKeyConstraint: true });
		m.Place.belongsTo(m.User, { as: 'author', foreignKeyConstraint: true })
		m.Image.belongsTo(m.User, { as: 'author', foreignKeyConstraint: true })
		m.Avatar.belongsTo(m.User, { as: 'author', foreignKeyConstraint: true })

	})(module.exports);
});

sequelize.sync();

// export connection
module.exports.sequelize = sequelize;