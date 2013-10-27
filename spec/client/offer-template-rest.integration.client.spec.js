define([ 'libs/jquery', 'libs/jquery.cookie', 'mods/rest' ], function($, undefined, rest) {

    $.cookie.json = true;

	describe('offer template REST integration test', function() {

    var authData = {
            'service' : 'facebook',
            'accessToken' : 'a2'
        },
        proto = {
            'title' : 'test title',
            'description' : 'lorem ipsum dolor sit amet',
            'recipe' : 'http://xxx.aaa.com/test-title',
            'pictures' : [
                    'http://xxx.aaa.com/test-title/image_001.jpg',
                    'http://xxx.aaa.com/test-title/image_002.jpg',
                    'http://xxx.aaa.com/test-title/image_003.jpg'
                ],
            'tags' : [ 'tag1', 'tag2', 'tag3' ]
        },
        currentRest = '/offer-template',
        user;

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
    
    it('should be GET rest with does not return any template entry', function() { 
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

   
    it('should be POST rest which creates first template entry', function() {
        rest.create(currentRest, proto,
           function(successCallback, errorCallback) {
                expect(errorCallback).not.toHaveBeenCalled();
                expect(successCallback).toHaveBeenCalled();
              
                var response = successCallback.mostRecentCall.args[0];
                expect(response).toBeDefined();
              
                proto = $.extend(proto, {
                    id: response.id,
                    recipe: {
                        id: response.recipe.id,
                        url: proto.recipe
                    },
                    author: user.id,
                    pictures: [
                            { id: response.pictures[0].id, filename: 'image_001.jpg' },
                            { id: response.pictures[1].id, filename: 'image_002.jpg' },
                            { id: response.pictures[2].id, filename: 'image_003.jpg' }
                        ],
                    tags: [
                            { id: response.tags[0].id, text: 'tag1' },
                            { id: response.tags[1].id, text: 'tag2' },
                            { id: response.tags[2].id, text: 'tag3' }
                        ]
                });
              
                expect(response).toEqual(proto);

                var status = successCallback.mostRecentCall.args[1];
                expect(status).toEqual(rest.codes.created);
           });
    });

    
    it('should be GET rest with returns first template entry', function() { 
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

    
    it('should be UPDATE rest allows change template entry properties', function() {
        
        var newAttrs = {
            title: 'ccc',
            description: 'tra la la tra la la'
        };
        
        rest.update(currentRest + '/' + proto.id, newAttrs,
            function(successCallback, errorCallback) {
                expect(errorCallback).not.toHaveBeenCalled();
                expect(successCallback).toHaveBeenCalled();
              
                proto = $.extend(proto, newAttrs);
              
                var response = successCallback.mostRecentCall.args[0];
                expect(response).toBeDefined();
                expect(response).toEqual(proto);

                var status = successCallback.mostRecentCall.args[1];
                expect(status).toEqual(rest.codes.ok);
           });
    });

   
    it('should be DELETE rest deletes template entry', function() {
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
    
    
    it('should be GET rest with does not return any template entry', function() { 
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