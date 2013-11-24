var Sequelize = $require('sequelize'),
    config = $require('config').database;

// initialize database connection
var sequelize = new Sequelize(
    config.name,
    config.username,
    config.password,
    {
        logging: !!config.logging,
        define: {
            charset: 'utf8',
            collate: 'utf8_general_ci'
        },
        language: 'en'
    }
);


// load models
$require('fs').readdir(__dirname + '/models', function(err, files) {
    files.filter(function(filename) { // all files except index.js
        return (/.js$/).test(filename) && (filename !== 'index.js');
    }).forEach(function(filename) {
        var modelname = _.capitalize(_.camelize(filename)).slice(0, -3); // request-template.js -> RequestTemplate
        module.exports[modelname] = sequelize.import(__dirname + '/models/' + filename);
        module.exports[modelname].sync();
    });

    // describe relationships
    (function(m) {

        m.OfferTemplate.belongsTo(m.User, { as: 'Author', foreignKey: 'AuthorId' });
        m.OfferTemplate.belongsTo(m.Recipe);
        

        m.OfferTemplate.hasMany(m.Image, { as: 'Pictures' });
        m.Image.hasMany(m.OfferTemplate);
        
        m.OfferTemplate.hasMany(m.Tag);
        m.Tag.hasMany(m.OfferTemplate);
        

        m.Offer.belongsTo(m.OfferTemplate, { as: 'Template', foreignKey: 'TemplateId' });
        m.Offer.belongsTo(m.Place);
        m.Offer.belongsTo(m.User, { as: 'Author', foreignKey: 'AuthorId' });
        m.Offer.hasMany(m.Comment);

        m.Comment.belongsTo(m.Response);
        m.Comment.belongsTo(m.User, { as: 'Author', foreignKey: 'AuthorId' });
        m.Comment.belongsTo(m.Comment, { as: 'Parent', foreignKey: 'ParentId' });

        m.Response.belongsTo(m.Offer);
        m.Response.belongsTo(m.User, { as: 'Author', foreignKey: 'AuthorId' });

        /* -- */

        m.User.belongsTo(m.Image, { as: 'Avatar', foreignKey: 'AvatarId' });
        m.User.belongsTo(m.Place);

        m.User.belongsTo(m.AuthData);

        m.UserRating.belongsTo(m.User, { as: 'Target', foreignKey: 'TargetId' });
        m.UserRating.belongsTo(m.Response);

        /* -- */

        m.UserRating.belongsTo(m.User, { as: 'Author', foreignKey: 'AuthorId' });
        m.Tag.belongsTo(m.User, { as: 'Author', foreignKey: 'AuthorId' });
        m.Recipe.belongsTo(m.User, { as: 'Author', foreignKey: 'AuthorId' });
        m.Place.belongsTo(m.User, { as: 'Author', foreignKey: 'AuthorId' });
        m.Image.belongsTo(m.User, { as: 'Author', foreignKey: 'AuthorId' });

        console.log('Database initialization...');
        sequelize.sync({ force: !!config.recreate }).then( // try create models in db
            function() {
                console.log('All models created in database!');
            },
            function(err) {
                throw new Error('Database initialization failed! ' + err);
            });

    })(module.exports);
});

// export connection
module.exports.sequelize = sequelize;