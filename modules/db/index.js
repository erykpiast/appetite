var Sequelize = require('sequelize'),
            _ = require('../../libs/underscore'),
       config = require('config').database;

// initialize database connection
var sequelize = new Sequelize(
  config.name,
  config.username,
  config.password,
  {

  }
);


// load models
[
  'User'
  'Request',
  // 'ActualRequest',
  // 'RequestResponse',
  'Offer',
  // 'ActualOffer',
  // 'OfferResponse',
  'Image',
  'Place'
].forEach(function(model) {
    var filename = _.ltrim(_.dasherize(model), '-'); // ActualRequest -> actual-request
    module.exports[model] = sequelize.import(__dirname + '/' + filename);
});

// describe relationships
(function(m) {
  // m.ActualRequest.hasOne(m.Request);

  // m.Request.hasMany(m.Image);
  // m.Image.hasMany(m.Request);

  // m.ActualRequest.hasMany(m.RequestResponse);
  // m.RequestResponse.hasOne(m.ActualRequest);

  // /* -- */

  // m.ActualOffer.hasOne(m.Offer);

  // m.Offer.hasMany(m.Image);
  // m.Image.hasMany(m.Offer);

  // m.ActualOffer.hasMany(m.OfferResponse);
  // m.OfferResponse.hasOne(m.ActualOffer);

})(module.exports);

// export connection
module.exports.sequelize = sequelize;