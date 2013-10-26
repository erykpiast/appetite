define([ 'libs/jquery', 'libs/jquery.cookie', 'mods/rest' ], function($, undefined, rest) {

$.cookie.json = true;


describe('offer template REST integration test', function() {

    var authData = {
            'service' : 'facebook',
            'accessToken' : 'a2'
        };

    it('should be POST rest which prepares user entry', function() {
        $.cookie('auth', { service: authData.service, accessToken: authData.accessToken }, { path: '/' });

        rest.create('/user', {
            'firstName' : 'c',
            'lastName' : 'd'
        });
    });

    var proto = {
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
        currentRest = '/offer-template';
    
    it('should be GET rest with does not return any template entry', function() { 
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

   
    it('should be POST rest which creates first template entry', function() {
        rest.create(currentRest, proto,
           function(successCallback, errorCallback) {
                expect(errorCallback).not.toHaveBeenCalled();
                expect(successCallback).toHaveBeenCalled();
              
                proto = $.extend(proto, {
                    id: 1,
                    recipe: {
                        id: 1,
                        url: proto.recipe
                    },
                    author: 2,
                    pictures: [
                            { id: 1, filename: 'image_001.jpg' },
                            { id: 2, filename: 'image_002.jpg' },
                            { id: 3, filename: 'image_003.jpg' }
                        ],
                    tags: [
                            { id: 1, text: 'tag1' },
                            { id: 2, text: 'tag2' },
                            { id: 3, text: 'tag3' }
                        ]
                });
              
                var response = successCallback.mostRecentCall.args[0];
                expect(response).toBeDefined();
                expect(response).toEqual(proto);

                var status = successCallback.mostRecentCall.args[1];
                expect(status).toEqual(rest.codes.created);
           });
    });

    
    it('should be GET rest with returns first template entry', function() { 
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

    
    it('should be UPDATE rest allows change template entry properties', function() {
        
        var newAttrs = {
            title: 'ccc',
            description: 'tra la la tra la la'
        };
        
        rest.update(currentRest + '/1', newAttrs,
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
    
    
    it('should be GET rest with does not return any template entry', function() { 
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


describe('offer REST integration test', function() {


    it('should be POST rest which prepares offer template entry', function() {
        rest.create('/offer-template', {
            'title' : 'dadadadad',
            'description' : 'ada adada adwaha adaedsfg adfga dfa',
            'recipe' : 'http://xxx.aaa.com/test-title'
        });
    });


    var proto = {
            'place' : 'p1',
            'template' : 2,
            'type' : 'offer'
        },
        currentRest = '/offer';
    
    it('should be GET rest with does not return any offer entry', function() { 
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

   
    it('should be POST rest which creates first offer entry', function() {
        rest.create(currentRest, proto,
           function(successCallback, errorCallback) {
                expect(errorCallback).not.toHaveBeenCalled();
                expect(successCallback).toHaveBeenCalled();
              
                proto = $.extend(proto, {
                    id: 1,
                    place: {
                        id: 1,
                        serviceId: proto.place
                    },
                    author: 2,
                    startAt: (new Date(0)).toISOString(),
                    endAt: (new Date(0)).toISOString(),
                    template: {
                        id: 2,
                        author: 2,
                        title: 'dadadadad',
                        description: 'ada adada adwaha adaedsfg adfga dfa',
                        recipe: {
                            id: 1,
                            url: 'http://xxx.aaa.com/test-title'
                        },
                        pictures: [ ],
                        tags: [ ]
                    }
                });
              
                var response = successCallback.mostRecentCall.args[0];
                expect(response).toBeDefined();
                expect(response).toEqual(proto);

                var status = successCallback.mostRecentCall.args[1];
                expect(status).toEqual(rest.codes.created);
           });
    });

    
    it('should be GET rest with returns first offer entry', function() { 
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

    
    it('should be UPDATE rest allows change offer entry properties', function() {
        
        proto = $.extend(proto, {
            startAt: (new Date(123000)).toISOString(),
            endAt: (new Date(234000)).toISOString()
        });
        
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

   
    it('should be DELETE rest deletes offer entry', function() {
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

    
    it('should be GET rest with does not return any offer entry', function() { 
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


describe('response REST integration test', function() {


    it('should be POST rest which prepares offer entry', function() {
        var authData = { // response can't be created by offer owner
                'service' : 'facebook',
                'accessToken' : 'a2'
            };

        $.cookie('auth', { service: authData.service, accessToken: authData.accessToken }, { path: '/' });

        rest.create('/offer', {
            'place' : 'p1',
            'template' : 2,
            'type' : 'offer'
        });
    });

    

    it('should be POST rest which prepares user entry', function() {
        var authData = { // response can't be created by offer owner
                'service' : 'facebook',
                'accessToken' : 'a3'
            };

        $.cookie('auth', { service: authData.service, accessToken: authData.accessToken }, { path: '/' });

        rest.create('/user', {
            'firstName' : 'e',
            'lastName' : 'f'
        });
    });

    var proto = {
            'offer' : 2
        },
        currentRest = '/response';

    
    it('should be GET rest with does not return any response entry', function() { 
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

   
    it('should be POST rest which creates first response entry', function() {
        rest.create(currentRest, proto,
           function(successCallback, errorCallback) {
                expect(errorCallback).not.toHaveBeenCalled();
                expect(successCallback).toHaveBeenCalled();
              
                proto = $.extend(proto, {
                    id: 1,
                    accepted: false,
                    author: 3
                });
              
                var response = successCallback.mostRecentCall.args[0];
                expect(response).toBeDefined();
                expect(response).toEqual(proto);

                var status = successCallback.mostRecentCall.args[1];
                expect(status).toEqual(rest.codes.created);
           });
    });

    
    it('should be GET rest with returns first response entry', function() { 
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

    
    it('should be UPDATE rest allows change response entry properties', function() {
        var authData = {
                'service' : 'facebook',
                'accessToken' : 'a2'
            };

        $.cookie('auth', { service: authData.service, accessToken: authData.accessToken }, { path: '/' }); // only offer owner can accept response
        
        proto = $.extend(proto, {
            accepted: true
        });
        
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

   
    it('should be DELETE rest deletes response entry', function() {
        var authData = { // only response owner can destroy entry
                'service' : 'facebook',
                'accessToken' : 'a3'
            };

        $.cookie('auth', { service: authData.service, accessToken: authData.accessToken }, { path: '/' });

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

    
    it('should be GET rest with does not return any response entry', function() { 
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


describe('comment REST integration test', function() {


    it('should be POST rest which prepares response entry', function() {
        rest.create('/response', {
            'offer' : 2
        });
    });


    var proto = {
            'content' : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore, tempora, accusamus minima excepturi quaerat minus laudantium nostrum itaque? Voluptates cumque temporibus repellendus modi nisi vel quam exercitationem totam impedit deleniti.',
            'offer' : 2
        },
        currentRest = '/comment';
    
    it('should be GET rest with does not return any comment entry', function() { 
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

   
    it('should be POST rest which creates first comment entry', function() {
        rest.create(currentRest, proto,
           function(successCallback, errorCallback) {
                expect(errorCallback).not.toHaveBeenCalled();
                expect(successCallback).toHaveBeenCalled();
              
                proto = $.extend(proto, {
                    id: 1,
                    response: {
                        id: 2,
                        offer: 2,
                        accepted: false,
                        author: 3
                    }
                });
              
                var response = successCallback.mostRecentCall.args[0];
                expect(response).toBeDefined();
                expect(response).toEqual(proto);

                var status = successCallback.mostRecentCall.args[1];
                expect(status).toEqual(rest.codes.created);
           });
    });

    
    it('should be GET rest with returns first comment entry', function() { 
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

    
    it('should be UPDATE rest allows change comment entry properties', function() {
        
        proto = $.extend(proto, {
            content: 'Lorem ipsum!'
        });
        
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

   
    it('should be DELETE rest deletes comment entry', function() {
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

    
    it('should be GET rest with does not return any comment entry', function() { 
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

});