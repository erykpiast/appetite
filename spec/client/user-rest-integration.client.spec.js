define([ 'libs/jquery', 'libs/jquery.cookie', 'mods/rest' ], function($, undefined, rest) {

    $.cookie.json = true;

	describe('user REST integration test', function() {
    
    var authData = {
            'service' : 'facebook',
            'accessToken' : 'a1'
        };
    
    var proto = {
            'firstName' : 'a',
            'lastName' : 'b'
        },
        currentRest = '/user';
    
    it('should be GET rest with does not return any user entry', function() { 
        $.cookie('auth', { service: authData.service, accessToken: authData.accessToken }, { path: '/' });

        rest.retrieve(currentRest + '/1',
           function(successCallback, errorCallback) {
                expect(successCallback).not.toHaveBeenCalled();
                expect(errorCallback).toHaveBeenCalled();
              
                var response = errorCallback.mostRecentCall.args[0];
                expect(response).toBeDefined();
                expect(response.msg).toBeDefined();

                var status = errorCallback.mostRecentCall.args[1];
                expect(status).toEqual(rest.codes.notFound);
           });
    });
   
    it('should be POST rest which creates first user entry', function() {
        rest.create(currentRest, proto,
           function(successCallback, errorCallback) {
                expect(errorCallback).not.toHaveBeenCalled();
                expect(successCallback).toHaveBeenCalled();
              
                proto = $.extend(proto, {
                    id: 1,
                    gender: 'unknown',
                    site: '',
                    authService: authData.service
                });
              
                var response = successCallback.mostRecentCall.args[0];
                expect(response).toBeDefined();
                expect(response).toEqual(proto);

                var status = successCallback.mostRecentCall.args[1];
                expect(status).toEqual(rest.codes.created);
           });
    });
    
    it('should be GET rest with returns first user entry', function() { 
        rest.retrieve(currentRest + '/1',
           function(successCallback, errorCallback) {
                expect(errorCallback).not.toHaveBeenCalled();
                expect(successCallback).toHaveBeenCalled();
              
                var response = successCallback.mostRecentCall.args[0];
                expect(response).toBeDefined();
                expect(response).toEqual(proto);

                var status = successCallback.mostRecentCall.args[1];
                expect(status).toEqual(rest.codes.ok);
           });
    });
    
    it('should be UPDATE rest allows change user entry properties', function() {
        proto.gender = 'male';
        proto.site = 'http://example.com/';
        
        rest.update(currentRest + '/1', proto,
            function(successCallback, errorCallback) {
                expect(errorCallback).not.toHaveBeenCalled();
                expect(successCallback).toHaveBeenCalled();
              
                var response = successCallback.mostRecentCall.args[0];
                expect(response).toBeDefined();
                expect(response).toEqual(proto);

                var status = successCallback.mostRecentCall.args[1];
                expect(status).toEqual(rest.codes.ok);
           });
    });
   
    it('should be DELETE rest deletes user entry', function() {
        rest.destroy(currentRest + '/1',
           function(successCallback, errorCallback) {
                expect(errorCallback).not.toHaveBeenCalled();
                expect(successCallback).toHaveBeenCalled();
              
                var response = successCallback.mostRecentCall.args[0];
                expect(response).toBeDefined();
                expect(response).toEqual(proto);

                var status = successCallback.mostRecentCall.args[1];
                expect(status).toEqual(rest.codes.ok);
           });
    });
    
    it('should be GET rest with does not return any user entry', function() { 
        rest.retrieve(currentRest + '/1',
           function(successCallback, errorCallback) {
                expect(successCallback).not.toHaveBeenCalled();
                expect(errorCallback).toHaveBeenCalled();
              
                var response = errorCallback.mostRecentCall.args[0];
                expect(response).toBeDefined();
                expect(response.msg).toBeDefined();

                var status = errorCallback.mostRecentCall.args[1];
                expect(status).toEqual(rest.codes.notFound);
           });
    });
    
});

})