define([ 'libs/angular', './module-auth' ],
function (angular, module) {

    module
    .run(function(authConfig, authData, authGeneric) {
        if(authData.restored) {
            delete authData.restored;

            authGeneric.use(authData.serviceName);

            authGeneric.autoLogin();
        }
    });

});