define([ 'libs/angular', './module-auth' ],
function (angular, module) {

    module
    .run(function(authConfig, authData, authGeneric) {
        if(authData.restored) {
            delete authData.restored;

            authGeneric.use(authData.service);

            authGeneric.autoLogin();
        }
    });

});