define([ 'libs/jquery', 'libs/jquery-cookie', 'mods/rest' ], function($, undefined, rest) {

	describe('tag REST integration test', function() {
    
        var authData = {
                'serviceName' : 'test',
                'userId': 'a10',
                'accessToken' : 'a10'
            },
            proto = {
                'text': 'tag1'
            },
            currentRest = '/tag',
            user;


        it('should be POST rest which prepares user entry', function() {
            $.cookie('auth', JSON.stringify(authData), { path: '/' });

            rest.create('/user', {
                'firstName' : 'l',
                'lastName' : 'm'
            }, function(successCallback) {
                expect(successCallback).toHaveBeenCalled();
                
                var response = successCallback.mostRecentCall.args[0];
                
                expect(response).toBeDefined();
                    
                user = response;
            });
        });

        
        it('should be GET rest with does not return any tag entry', function() {     
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
       

        it('should be POST rest which creates first tag entry', function() {
            rest.create(currentRest, proto,
               function(successCallback, errorCallback) {
                    expect(errorCallback).not.toHaveBeenCalled();
                    expect(successCallback).toHaveBeenCalled();
                  
                    var response = successCallback.mostRecentCall.args[0];
                    expect(response).toBeDefined();

                    proto = $.extend(proto, {
                        id: response.id
                    });
                  
                    expect(response).toEqual(proto);
    
                    var status = successCallback.mostRecentCall.args[1];
                    expect(status).toEqual(rest.codes.created);
               });
        });
        

        it('should be GET rest with returns first tag entry', function() { 
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


        it('should be POST rest which creates tag entry', function() {
            rest.create(currentRest, { text: 'tag2' },
               function(successCallback, errorCallback) {
                    expect(errorCallback).not.toHaveBeenCalled();
                    expect(successCallback).toHaveBeenCalled();
                  
                    var response = successCallback.mostRecentCall.args[0];
                    expect(response).toBeDefined();
               });
        });


        it('should be POST rest which creates tag entry', function() {
            rest.create(currentRest, { text: 'tag3' },
               function(successCallback, errorCallback) {
                    expect(errorCallback).not.toHaveBeenCalled();
                    expect(successCallback).toHaveBeenCalled();
                  
                    var response = successCallback.mostRecentCall.args[0];
                    expect(response).toBeDefined();
               });
        });


        it('should be GET rest with returns first tag entry', function() { 
            rest.retrieve(currentRest + '/',
               function(successCallback, errorCallback) {
                    expect(errorCallback).not.toHaveBeenCalled();
                    expect(successCallback).toHaveBeenCalled();
                  
                    var response = successCallback.mostRecentCall.args[0];
                    expect(response).toBeDefined();
                    expect(response.length).not.toBeLessThan(3);
    
                    var status = successCallback.mostRecentCall.args[1];
                    expect(status).toEqual(rest.codes.ok);
               });
        });

        
    });

})