var Sequelize = $require('sequelize'),
    config = $require('config').database;

// initialize database connection
var sequelize = new Sequelize(
    config.name,
    config.username,
    config.password,
    {
        pool: { maxConnections: 5, maxIdleTime: 30 },
        define: {
            charset: 'utf8',
            collate: 'utf8_general_ci'
        }
    }
);


// load models
$require('fs').readdir(__dirname + '/models', function(err, files) {
    files.filter(function(filename) { // all files except index.js
        return (/.js$/).test(filename) && (filename !== 'index.js');
    }).forEach(function(filename) {
        var modelname = _.capitalize(_.camelize(filename)).slice(0, -3); // request-template.js -> RequestTemplate
        module.exports[modelname] = sequelize.import(__dirname + '/models/' + filename);
    });

    // describe relationships
    (function(m) {
        
        m.RequestTemplate.belongsTo(m.User, { as: 'Author', foreignKey: 'AuthorId' });
        m.RequestTemplate.belongsTo(m.Recipe);
        
        m.RequestTemplate.hasMany(m.Image);
        m.Image.hasMany(m.RequestTemplate);
        

        m.Request.belongsTo(m.RequestTemplate, { as: 'Template', foreignKey: 'TemplateId' });
        m.Request.belongsTo(m.Place);
        m.Request.belongsTo(m.User, { as: 'Author', foreignKey: 'AuthorId' });
        
        
        m.RequestResponse.belongsTo(m.Request);
        m.RequestResponse.belongsTo(m.User, { as: 'Author', foreignKey: 'AuthorId' });

        /* -- */

        m.OfferTemplate.belongsTo(m.User, { as: 'Author', foreignKey: 'AuthorId' });
        m.OfferTemplate.belongsTo(m.Recipe);
        
        m.OfferTemplate.hasMany(m.Image);
        m.Image.hasMany(m.OfferTemplate);
        

        m.Offer.belongsTo(m.OfferTemplate, { as: 'Template', foreignKey: 'TemplateId' });
        m.Offer.belongsTo(m.Place);
        m.Offer.belongsTo(m.User, { as: 'Author', foreignKey: 'AuthorId' });
        
        
        m.OfferResponse.belongsTo(m.Offer);
        m.OfferResponse.belongsTo(m.User, { as: 'Author', foreignKey: 'AuthorId' });

        /* -- */

        m.User.belongsTo(m.Avatar);
        m.User.belongsTo(m.Place);

        m.Like.belongsTo(m.User);
        m.Like.belongsTo(m.Recipe);

        /* -- */

        m.Recipe.belongsTo(m.User, { as: 'Author', foreignKey: 'AuthorId' });
        m.Place.belongsTo(m.User, { as: 'Author', foreignKey: 'AuthorId' });
        m.Image.belongsTo(m.User, { as: 'Author', foreignKey: 'AuthorId' });
        m.Avatar.belongsTo(m.User, { as: 'Author', foreignKey: 'AuthorId' });

        console.log('Database initialization...');
        console.log('===========================================================');
        sequelize.sync({ force: false }) // try create models in db
            .success(function(err) {
                console.log('===========================================================');
                console.log('All models created in database!');
            })
            .error(function(err) {
                throw new Error('Database initialization failed! ' + err);
            });

    })(module.exports);
});

// export connection
module.exports.sequelize = sequelize;