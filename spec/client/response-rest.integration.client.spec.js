define([ 'libs/jquery', 'libs/jquery-cookie', 'mods/rest' ], function($, undefined, rest) {

    

    describe('response REST integration test', function() {
    
        var currentRest = '/response',
            user1AuthData = {
                'serviceName' : 'test',
                'userId': 'a4',
                'accessToken' : 'a4'
            },
            user2AuthData = {
                'serviceName' : 'test',
                'userId': 'a5',
                'accessToken' : 'a5'
            },
            proto = { },
            user1, user2,
            offerTemplate, offer;
    
        it('should be POST rest which prepares offer owner entry', function() {
            $.cookie('auth', JSON.stringify(user1AuthData), { path: '/' });
    
            rest.create('/user', {
                'firstName' : 'e',
                'lastName' : 'f'
            }, function(successCallback) {
                expect(successCallback).toHaveBeenCalled();
                
                var response = successCallback.mostRecentCall.args[0];
                
                expect(response).toBeDefined();
                    
                user1 = response;
            });
        });


        it('should be POST rest which prepares offer template entry', function() {
            rest.create('/offer-template', {
                'title' : 'dadadadad',
                'description' : 'ada adada adwaha adaedsfg adfga dfa',
                'recipe' : 'http://xxx.aaa.com/test-title'
            }, function(successCallback) {
                expect(successCallback).toHaveBeenCalled();
                
                var response = successCallback.mostRecentCall.args[0];
            
                expect(response).toBeDefined();
                    
                offerTemplate = response;
            });
        });
        
        
        it('should be POST rest which prepares offer entry', function() {
            rest.create('/offer', {
                'place' : 'p1',
                'template' : offerTemplate.id,
                'type' : 'offer',
                'startAt' : Date.now() + 2000,
                'endAt' : Date.now() + (3 * 24 * 60 * 60 * 1000)
            }, function(successCallback, errorCallback) {
                    expect(successCallback).toHaveBeenCalled();
                  
                    var response = successCallback.mostRecentCall.args[0];
                    
                    expect(response).toBeDefined();
                  
                    offer = response;
               });
        });
        
        
        it('should be POST rest which prepares response owner entry', function() {
            $.cookie('auth', JSON.stringify(user2AuthData), { path: '/' });
    
            rest.create('/user', {
                'firstName' : 'g',
                'lastName' : 'h'
            }, function(successCallback) {
                expect(successCallback).toHaveBeenCalled();
                
                var response = successCallback.mostRecentCall.args[0];
                
                expect(response).toBeDefined();
                    
                user2 = response;
            });
        });
    
        
        it('should be GET rest with does not return any response entry', function() { 
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
    
       
        it('should be POST rest which creates first response entry', function() {
            proto.offer = offer.id;
            
            rest.create(currentRest, proto,
               function(successCallback, errorCallback) {
                    expect(errorCallback).not.toHaveBeenCalled();
                    expect(successCallback).toHaveBeenCalled();
                  
                    var response = successCallback.mostRecentCall.args[0];
                    expect(response).toBeDefined();
                  
                    proto = $.extend(proto, {
                        id: response.id,
                        accepted: false,
                        author: user2.id
                    });
                  
                    
                    expect(response).toEqual(proto);
    
                    var status = successCallback.mostRecentCall.args[1];
                    expect(status).toEqual(rest.codes.created);
               });
        });
    
        
        it('should be GET rest with returns first response entry', function() { 
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
    
        
        it('should be UPDATE rest allows change response entry properties', function() {
            $.cookie('auth', JSON.stringify(user1AuthData), { path: '/' }); // only offer owner can accept response
            
            proto = $.extend(proto, {
                accepted: true
            });
            
            rest.update(currentRest + '/' + proto.id, proto,
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
    

        it('should be POST rest which creates first response entry', function() {
            $.cookie('auth', JSON.stringify(user2AuthData), { path: '/' });
            
            rest.create(currentRest, proto,
               function(successCallback, errorCallback) {
                    expect(errorCallback).not.toHaveBeenCalled();
                    expect(successCallback).toHaveBeenCalled();
                  
                    var response = successCallback.mostRecentCall.args[0];
                    expect(response).toBeDefined();

                    $.extend(proto, {
                        id: response.id,
                        accepted: false
                    });

                    var status = successCallback.mostRecentCall.args[1];
                    expect(status).toEqual(rest.codes.created);
               });
        });

       
        it('should be DELETE rest deletes response entry', function() {
            $.cookie('auth', JSON.stringify(user2AuthData), { path: '/' });
    
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
    
        
        it('should be GET rest with does not return any response entry', function() { 
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