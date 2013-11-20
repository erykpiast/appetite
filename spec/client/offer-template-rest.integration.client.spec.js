define([ 'libs/jquery', 'libs/jquery.cookie', 'mods/rest' ], function($, undefined, rest) {

    $.cookie.json = true;

	describe('offer template REST integration test', function() {

    var authData = {
            'service' : 'facebook',
            'userId': 'a2',
            'accessToken' : 'a2'
        },
        imagePrefix = window.location.protocol + '//' + window.location.hostname + ':' + 3000 + '/static/images',
        proto = {
            'title' : 'test title',
            'description' : 'lorem ipsum dolor sit amet',
            'recipe' : 'http://xxx.aaa.com/test-title',
            'pictures' : [
                    imagePrefix + '/0001.jpg',
                    imagePrefix + '/0002.jpg',
                    imagePrefix + '/0003.jpg'
                ],
            'tags' : [ 'tag1', 'tag2', 'tag3' ]
        },
        currentRest = '/offer-template',
        user;

    it('should be POST rest which prepares user entry', function() {
        $.cookie('auth', { service: authData.service, userId: authData.userId, accessToken: authData.accessToken }, { path: '/' });

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
                        url: proto.recipe,
                        domain: 'xxx.aaa.com'
                    },
                    author: user.id,
                    pictures: [
                            { id: response.pictures[0].id, filename: '8492a1a763364b2ca2d7b12ba1a50ead.jpg' },
                            { id: response.pictures[1].id, filename: 'a2d9b84f20a59a3d76b5e2029825121c.jpg' },
                            { id: response.pictures[2].id, filename: 'b4c614c77768557c937c68e2435f2c71.jpg' }
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
        
        rest.update(currentRest + '/' + proto.id, {
                title: 'ccc',
                description: 'tra la la tra la la',
                pictures : [
                        imagePrefix + '/0001.jpg',
                        imagePrefix + '/0002.jpg',
                        imagePrefix + '/0004.jpg',
                        imagePrefix + '/0005.jpg'
                    ],
                'tags' : [ 'tag1', 'tag4', 'tag5' ]
            }, function(successCallback, errorCallback) {
                expect(errorCallback).not.toHaveBeenCalled();
                expect(successCallback).toHaveBeenCalled();
              
                var response = successCallback.mostRecentCall.args[0];
                expect(response).toBeDefined();

                proto = $.extend(proto, {
                    title: 'ccc',
                    description: 'tra la la tra la la',
                    pictures: [
                        { id: response.pictures[0].id, filename: '8492a1a763364b2ca2d7b12ba1a50ead.jpg' },
                        { id: response.pictures[1].id, filename: 'a2d9b84f20a59a3d76b5e2029825121c.jpg' },
                        { id: response.pictures[2].id, filename: '07a4525b1365727efcd8dfe07d02c43d.jpg' },
                        { id: response.pictures[3].id, filename: '638441e1fb13d67dd57e040413bace59.jpg' }
                    ],
                    tags: [
                        { id: response.tags[0].id, text: 'tag1' },
                        { id: response.tags[1].id, text: 'tag4' },
                        { id: response.tags[2].id, text: 'tag5' }
                    ]
                });
              
                expect(response).toEqual(proto);

                var status = successCallback.mostRecentCall.args[1];
                expect(status).toEqual(rest.codes.ok);
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