define([ 'libs/jquery', 'libs/jquery-cookie', 'mods/rest' ], function($, undefined, rest) {

    $.cookie.json = true;

    describe('comment REST integration test', function() {
    
    
        var currentRest = '/comment',
            user1AuthData = {
                'service' : 'facebook',
                'userId': 'a6',
                'accessToken' : 'a6'
            },
            user2AuthData = {
                'service' : 'facebook',
                'userId': 'a7',
                'accessToken' : 'a7'
            },
            proto = {
                'content' : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore, tempora, accusamus minima excepturi quaerat minus laudantium nostrum itaque? Voluptates cumque temporibus repellendus modi nisi vel quam exercitationem totam impedit deleniti.',
            },
            user1, user2,
            offerTemplate, offer, response;
    
        it('should be POST rest which prepares offer owner entry', function() {
            var authData = user1AuthData;
                
            $.cookie('auth', { service: authData.service, userId: authData.userId, accessToken: authData.accessToken }, { path: '/' });
    
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
            var authData = user2AuthData;
            
            $.cookie('auth', { service: authData.service, userId: authData.userId, accessToken: authData.accessToken }, { path: '/' });
    
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
    
    
        it('should be POST rest which prepares response entry', function() {
            rest.create('/response', {
                'offer' : offer.id
            }, function(successCallback, errorCallback) {
                    expect(successCallback).toHaveBeenCalled();
                  
                    var _response = successCallback.mostRecentCall.args[0];
                    
                    expect(_response).toBeDefined();
                  
                    response = _response;
               });
        });
        
        it('should be GET rest with does not return any comment entry', function() { 
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
    
       
        it('should be POST rest which creates first comment entry', function() {
            proto.offer = offer.id;
            proto.response = response.id;
            
            rest.create(currentRest, proto,
               function(successCallback, errorCallback) {
                    expect(errorCallback).not.toHaveBeenCalled();
                    expect(successCallback).toHaveBeenCalled();
                  
                    var _response = successCallback.mostRecentCall.args[0];
                    expect(_response).toBeDefined();
                  
                    proto = $.extend(proto, {
                        id: _response.id,
                        author: user2.id,
                        createdAt: _response.createdAt,
                        updatedAt: _response.updatedAt,
                        response: response,
                        parent: 0
                    });
                    
                    expect(_response).toEqual(proto);
    
                    var status = successCallback.mostRecentCall.args[1];
                    expect(status).toEqual(rest.codes.created);
               });
        });
    
        
        it('should be GET rest with returns first comment entry', function() { 
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
    
        
        it('should be UPDATE rest allows change comment entry properties', function() {
            
            rest.update(currentRest + '/' + proto.id, {
                    content: 'Lorem ipsum!'
                }, function(successCallback, errorCallback) {
                    expect(errorCallback).not.toHaveBeenCalled();
                    expect(successCallback).toHaveBeenCalled();
                  
                    var response = successCallback.mostRecentCall.args[0];
                    expect(response).toBeDefined();

                    proto = $.extend(proto, {
                        content: 'Lorem ipsum!',
                        updatedAt: response.updatedAt
                    });

                    expect(response).toEqual(proto);
    
                    var status = successCallback.mostRecentCall.args[1];
                    expect(status).toEqual(rest.codes.ok);
               });
        });
    
       
        it('should be DELETE rest deletes comment entry', function() {
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
    
        
        it('should be GET rest with does not return any comment entry', function() { 
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


        it('should be POST rest which prepares comment entry', function() {
            rest.create(currentRest, {
                    offer: offer.id,
                    content: 'Lorem ipsum dolor sit amet...'
                },
                function(successCallback, errorCallback) {
                    expect(errorCallback).not.toHaveBeenCalled();
                    expect(successCallback).toHaveBeenCalled();
                  
                    var response = successCallback.mostRecentCall.args[0];
                    expect(response).toBeDefined();
    
                    var status = successCallback.mostRecentCall.args[1];
                    expect(status).toEqual(rest.codes.created);
                });
        });


        it('should be POST rest which prepares comment entry', function() {
            rest.create(currentRest, {
                    offer: offer.id,
                    content: 'Sit amet! Lorem ipsum.'
                },
                function(successCallback, errorCallback) {
                    expect(errorCallback).not.toHaveBeenCalled();
                    expect(successCallback).toHaveBeenCalled();
                  
                    var response = successCallback.mostRecentCall.args[0];
                    expect(response).toBeDefined();
    
                    var status = successCallback.mostRecentCall.args[1];
                    expect(status).toEqual(rest.codes.created);
                });
        });


        it('should be GET rest with returns all comment entries for the offer', function() { 
            rest.retrieve('/offer/' + offer.id + '/comments',
               function(successCallback, errorCallback) {
                    expect(errorCallback).not.toHaveBeenCalled();
                    expect(successCallback).toHaveBeenCalled();
                  
                    var response = successCallback.mostRecentCall.args[0];
                    expect(response).toBeDefined();
                    expect(response.length).toBeGreaterThan(0);
    
                    var status = successCallback.mostRecentCall.args[1];
                    expect(status).toEqual(rest.codes.ok);
               });
        });
        
    });

});