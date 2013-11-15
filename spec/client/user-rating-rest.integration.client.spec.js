define([ 'libs/jquery', 'libs/jquery.cookie', 'mods/rest' ], function($, undefined, rest) {

    $.cookie.json = true;

    describe('user rating REST integration test', function() {
    
    
        var currentRest = '/user/:userId/rating',
            user1AuthData = {
                'service' : 'facebook',
                'accessToken' : 'a8'
            },
            user2AuthData = {
                'service' : 'facebook',
                'accessToken' : 'a9'
            },
            proto = { },
            user1, user2,
            offerTemplate, offer, response;
    
        it('should be POST rest which prepares offer owner entry', function() {
            var authData = user1AuthData;
                
            $.cookie('auth', { service: authData.service, accessToken: authData.accessToken }, { path: '/' });
    
            rest.create('/user', {
                'firstName' : 'i',
                'lastName' : 'j'
            }, function(successCallback) {
                expect(successCallback).toHaveBeenCalled();
                
                var response = successCallback.mostRecentCall.args[0];
                
                currentRest = currentRest.replace(/(\:[^\/]+)/, response.id);
                
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
                'startAt' : Date.now(),
                'endAt' : Date.now() + (3 * 24 * 60 * 60 * 1000)
            }, function(successCallback, errorCallback) {
                    expect(successCallback).toHaveBeenCalled();
                  
                    var response = successCallback.mostRecentCall.args[0];
                    
                    expect(response).toBeDefined();
                  
                    offer = response;
               });
        });
        
        
        it('should be POST rest which prepares response owner entry', function() {
            var authData = user2AuthData;
            
            $.cookie('auth', { service: authData.service, accessToken: authData.accessToken }, { path: '/' });
    
            rest.create('/user', {
                'firstName' : 'k',
                'lastName' : 'l'
            }, function(successCallback) {
                expect(successCallback).toHaveBeenCalled();
                
                var _response = successCallback.mostRecentCall.args[0];
                
                expect(_response).toBeDefined();
                    
                response = _response;
            });
        });
    
    
        it('should be POST rest which prepares response entry', function() {
            rest.create('/response', {
                'offer' : offer.id
            }, function(successCallback, errorCallback) {
                    expect(successCallback).toHaveBeenCalled();
                  
                    var _response = successCallback.mostRecentCall.args[0];
                    
                    expect(_response).toBeDefined();
                  
                    response = _response;
                    proto.response = _response.id;
               });
        });


        it('should be PUT rest which updates response entry', function() {
            var authData = user1AuthData;
            
            $.cookie('auth', { service: authData.service, accessToken: authData.accessToken }, { path: '/' });
    
            rest.update('/response/' + response.id, {
                'accepted': true
            }, function(successCallback) {
                expect(successCallback).toHaveBeenCalled();
                
                var response = successCallback.mostRecentCall.args[0];
                
                expect(response).toBeDefined();
            });
        });

        
        it('should be GET rest with does not return any rating entry', function() { 
            rest.retrieve('/user/1000/rating',
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
    
       
        it('should be POST rest which creates first rating entry', function() {
            var authData = user2AuthData;
            
            $.cookie('auth', { service: authData.service, accessToken: authData.accessToken }, { path: '/' });

            proto.type = 'positive';

            rest.create(currentRest, proto,
               function(successCallback, errorCallback) {
                    expect(errorCallback).not.toHaveBeenCalled();
                    expect(successCallback).toHaveBeenCalled();
                  
                    var response = successCallback.mostRecentCall.args[0];
                    expect(response).toBeDefined();
                  
                    proto = $.extend(proto, {
                        id: response.id,
                        author: user2.id,
                        target: user1.id,
                        createdAt: response.createdAt
                    });
                    
                    expect(response).toEqual(proto);
    
                    var status = successCallback.mostRecentCall.args[1];
                    expect(status).toEqual(rest.codes.created);
               });
        });
    
        
        it('should be GET rest with returns first rating entry', function() {
            rest.retrieve(currentRest,
               function(successCallback, errorCallback) {
                    expect(errorCallback).not.toHaveBeenCalled();
                    expect(successCallback).toHaveBeenCalled();
                  
                    var response = successCallback.mostRecentCall.args[0];
                    expect(response).toBeDefined();
                    expect(response).toEqual({
                        'positives': 1,
                        'negatives': 0
                    });
    
                    var status = successCallback.mostRecentCall.args[1];
                    expect(status).toEqual(rest.codes.ok);
               });
        });


    // more ratings >>
        [ 'positive', 'positive', 'negative', 'negative' ].forEach(function(type) {

            it('should be POST rest which prepares offer entry', function() {
                var authData = user1AuthData;
                
                $.cookie('auth', { service: authData.service, accessToken: authData.accessToken }, { path: '/' });

                rest.create('/offer', {
                    'place' : 'p1',
                    'template' : offerTemplate.id,
                    'type' : 'offer',
                    'startAt' : Date.now(),
                    'endAt' : Date.now() + (3 * 24 * 60 * 60 * 1000)
                }, function(successCallback, errorCallback) {
                        expect(successCallback).toHaveBeenCalled();
                      
                        var response = successCallback.mostRecentCall.args[0];
                        
                        expect(response).toBeDefined();
                      
                        offer = response;
                   });
            });
        

            it('should be POST rest which prepares response entry', function() {
                var authData = user2AuthData;
                
                $.cookie('auth', { service: authData.service, accessToken: authData.accessToken }, { path: '/' });

                rest.create('/response', {
                    'offer' : offer.id
                }, function(successCallback, errorCallback) {
                        expect(successCallback).toHaveBeenCalled();
                      
                        var _response = successCallback.mostRecentCall.args[0];
                        
                        expect(_response).toBeDefined();
                      
                        response = _response;
                        proto.response = response.id;
                   });
            });


            it('should be PUT rest which updates response entry', function() {
                var authData = user1AuthData;
                
                $.cookie('auth', { service: authData.service, accessToken: authData.accessToken }, { path: '/' });
        
                rest.update('/response/' + response.id, {
                    'accepted': true
                }, function(successCallback) {
                    expect(successCallback).toHaveBeenCalled();
                    
                    var response = successCallback.mostRecentCall.args[0];
                    
                    expect(response).toBeDefined();
                });
            });
        
           
            it('should be POST rest which creates rating entry', function() {
                var authData = user2AuthData;
                
                $.cookie('auth', { service: authData.service, accessToken: authData.accessToken }, { path: '/' });

                proto.type = type;

                rest.create(currentRest, proto,
                   function(successCallback, errorCallback) {
                        expect(errorCallback).not.toHaveBeenCalled();
                        expect(successCallback).toHaveBeenCalled();
                      
                        var response = successCallback.mostRecentCall.args[0];
                        expect(response).toBeDefined();
        
                        var status = successCallback.mostRecentCall.args[1];
                        expect(status).toEqual(rest.codes.created);
                   });
            });

        });


        it('should be GET rest with returns rating entry', function() { 
            rest.retrieve(currentRest,
               function(successCallback, errorCallback) {
                    expect(errorCallback).not.toHaveBeenCalled();
                    expect(successCallback).toHaveBeenCalled();
                  
                    var response = successCallback.mostRecentCall.args[0];
                    expect(response).toBeDefined();
                    expect(response).toEqual({
                        'positives': 3,
                        'negatives': 2
                    });
    
                    var status = successCallback.mostRecentCall.args[1];
                    expect(status).toEqual(rest.codes.ok);
               });
        });
        
    });

});