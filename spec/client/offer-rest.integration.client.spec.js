define([ 'libs/jquery', 'libs/jquery.cookie', 'mods/rest' ], function($, undefined, rest) {

    $.cookie.json = true;

	describe('offer REST integration test', function() {

        var authData = {
                'service' : 'facebook',
                'accessToken' : 'a3'
            },
            proto = {
                'place' : 'p1',
                'type' : 'offer'
            },
            currentRest = '/offer',
            user,
            offerTemplate;
    
        it('should be POST rest which prepares user entry', function() {
            $.cookie('auth', { service: authData.service, accessToken: authData.accessToken }, { path: '/' });
    
            rest.create('/user', {
                'firstName' : 'c',
                'lastName' : 'd'
            }, function(successCallback) {
                expect(successCallback).toHaveBeenCalled();
                
                var response = successCallback.mostRecentCall.args[0];
                
                expect(response).toBeDefined();
                    
                user = response;
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
    
        
        it('should be GET rest with does not return any offer entry', function() { 
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
    
       
        it('should be POST rest which creates first offer entry', function() {
            proto.template = offerTemplate.id;
            
            rest.create(currentRest, proto,
               function(successCallback, errorCallback) {
                    expect(errorCallback).not.toHaveBeenCalled();
                    expect(successCallback).toHaveBeenCalled();
                  
                    var response = successCallback.mostRecentCall.args[0];
                    expect(response).toBeDefined();
                  
                    proto = $.extend(proto, {
                        id: response.id,
                        place: {
                            id: response.place.id,
                            serviceId: proto.place
                        },
                        author: user.id,
                        startAt: (new Date(0)).toISOString(),
                        endAt: (new Date(0)).toISOString(),
                        template: offerTemplate,
                        started: false,
                        ended: false
                    });
                    
                    expect(response).toEqual(proto);
    
                    var status = successCallback.mostRecentCall.args[1];
                    expect(status).toEqual(rest.codes.created);
               });
        });
    
        
        it('should be GET rest with returns first offer entry', function() { 
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
    
        
        it('should be UPDATE rest allows change offer entry properties', function() {
            
            var startDate, endDate;
            rest.update(currentRest + '/' + proto.id, {
                    startAt: startDate = Date.now() + 2000,
                    endAt: endDate = Date.now() + (4 * 24 * 60 * 60 * 1000)
                }, function(successCallback, errorCallback) {
                    expect(errorCallback).not.toHaveBeenCalled();
                    expect(successCallback).toHaveBeenCalled();
                  
                    proto = $.extend(proto, {
                        startAt: (new Date(parseInt(startDate / 1000) * 1000)).toISOString(),
                        endAt: (new Date(parseInt(endDate / 1000) * 1000)).toISOString(),
                        started: true,
                        ended: false
                    });

                    var response = successCallback.mostRecentCall.args[0];
                    expect(response).toBeDefined();
                    expect(response).toEqual(proto);
    
                    var status = successCallback.mostRecentCall.args[1];
                    expect(status).toEqual(rest.codes.ok);
               });
        });
        
        
        it('should be GET rest with returns first offer entry', function() { 
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
    
       
        it('should be DELETE rest deletes offer entry', function() {
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
    
        
        it('should be GET rest with does not return any offer entry', function() { 
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
        
        
        it('should be POST rest which prepares offer entry', function() {
            rest.create(currentRest, {
                    'template': offerTemplate.id,
                    'place' : 'p1',
                    'type' : 'offer',
                    'startAt' : Date.now() + 2000,
                    'endAt' : Date.now() + (3 * 24 * 60 * 60 * 1000),
                }, function(successCallback, errorCallback) {
                    expect(successCallback).toHaveBeenCalled();
                
                    var response = successCallback.mostRecentCall.args[0];
                    
                    expect(response).toBeDefined();
               });
        });


        it('should be POST rest which prepares offer entry', function() {
            rest.create(currentRest, {
                    'template': offerTemplate.id,
                    'place' : 'p2',
                    'type' : 'offer',
                    'startAt' : Date.now() + 2000,
                    'endAt' : Date.now() + (4 * 24 * 60 * 60 * 1000),
                }, function(successCallback, errorCallback) {
                    expect(successCallback).toHaveBeenCalled();
                
                    var response = successCallback.mostRecentCall.args[0];
                    
                    expect(response).toBeDefined();
               });
        });


        it('should be GET rest which returns all offer entries', function() { 
            rest.retrieve(currentRest,
               function(successCallback, errorCallback) {
                    expect(successCallback).toHaveBeenCalled();
                    expect(errorCallback).not.toHaveBeenCalled();
                  
                    var response = successCallback.mostRecentCall.args[0];
                    expect(response).toBeDefined();
                    expect(response.length).toBeGreaterThan(0);
    
                    var status = successCallback.mostRecentCall.args[1];
                    expect(status).toEqual(rest.codes.ok);
               });
        });

    });

})