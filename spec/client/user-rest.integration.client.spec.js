define([ 'libs/jquery', 'libs/jquery.cookie', 'mods/rest' ], function($, undefined, rest) {

    $.cookie.json = true;

	describe('user REST integration test', function() {
    
        var authData = {
                'service' : 'facebook',
                'accessToken' : 'a1'
            },
            proto = {
                'firstName' : 'a',
                'lastName' : 'b',
                'place' : 'p1'
            },
            currentRest = '/user';
        
        it('should be GET rest with does not return any user entry', function() { 
            $.cookie('auth', { service: authData.service, accessToken: authData.accessToken }, { path: '/' });
    
            rest.retrieve(currentRest + '/1000',
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
                  
                    var response = successCallback.mostRecentCall.args[0];
                    expect(response).toBeDefined();

                    delete proto.firstName;
                    delete proto.lastName;
                    proto = $.extend(proto, {
                        id: response.id,
                        fullName: 'a b',
                        gender: 'unknown',
                        site: '',
                        authService: authData.service,
                        place: {
                            id: response.place.id,
                            serviceId: proto.place
                        },
                        avatar: 0
                    });
                  
                    expect(response).toEqual(proto);
    
                    var status = successCallback.mostRecentCall.args[1];
                    expect(status).toEqual(rest.codes.created);
               });
        });
        
        it('should be GET rest with returns first user entry', function() { 
            rest.retrieve(currentRest + '/' + proto.id,
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
            
            rest.update(currentRest + '/' + proto.id, {
                    gender: 'male',
                    site: 'http://example.com/'
                }, function(successCallback, errorCallback) {
                    expect(errorCallback).not.toHaveBeenCalled();
                    expect(successCallback).toHaveBeenCalled();
                  
                    proto = $.extend(proto, {
                        gender: 'male',
                        site: 'http://example.com/'
                    });

                    var response = successCallback.mostRecentCall.args[0];
                    expect(response).toBeDefined();
                    expect(response).toEqual(proto);
    
                    var status = successCallback.mostRecentCall.args[1];
                    expect(status).toEqual(rest.codes.ok);
               });
        });
       
        it('should be DELETE rest deletes user entry', function() {
            rest.destroy(currentRest + '/' + proto.id,
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
            rest.retrieve(currentRest + '/' + proto.id,
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