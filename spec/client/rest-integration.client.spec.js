var serviceDomain = window.location.hostname + ':' + 3000;

var rest = (function(_pathPrefix, _httpCodes, _waitingTime, _log) {

        var pathPrefix = _pathPrefix || '/rest',
            httpCodes = _httpCodes || {
                notFound: 404,
                ok: 200,
                created: 201
            },
            waitingTime = _waitingTime || 20 * 1000,
            log = _log || false;
        
        function _prefix(path) {
           return (pathPrefix + path);
        }
        
        function _ajax(url, options) {
            var req = new XMLHttpRequest();
           
            req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    var res = req.responseText;
                    if(options.dataType === 'json') {
                        try {
                            res = JSON.parse(req.responseText);
                        } catch(e) {
                            res = null;
                        }
                    } else if(options.dataType === 'xml') {
                        res = req.responseXML;
                    }
                    
                    if(log) {
                        console.log(options.method + ':' + url, req.status, req.responseText);
                    }
                    
                    if((req.status >= 200) && (req.status < 400)) {
                        if(options.success) {
                            options.success(res, req.status, req);
                        }
                    } else if(req.status >= 400) {
                        if(options.error) {
                            options.error(res, req.status, req);
                        }
                    } else if(req.status === 0) {
                        throw 'Cross-domain issue!';
                    }
                }
            }
            
            req.open(options.method || 'GET', url, true);
            
            if(options.contentType) {
                req.setRequestHeader('Content-type', options.contentType);
            }
            
            if(options.dataType) {
                var type;
                
                switch(options.dataType) {
                    case 'json': type = 'application/json'
                        break;
                    case 'xml': type = 'text/xml'
                        break;
                    default: type = 'text/plain'
                }
                
                req.overrideMimeType(type);
            }
            
            if(options.data) {
                try {
                    options.data = JSON.stringify(options.data);
                } catch(e) {
                    options.data = options.data.toString();
                }
            }
            
            req.send(options.data);
        }
       
        function _request(url, conf, tests) {
            conf = (conf || {});
           
            var successCallback = conf.success = jasmine.createSpy();
            var errorCallback = conf.error = jasmine.createSpy();
            
            waitsFor(function() {
                return (successCallback.callCount > 0) || (errorCallback.callCount > 0);
            }, 'The Ajax call timed out', waitingTime);
           
            runs(function() {
                if(tests) {
                    tests.call(null, successCallback, errorCallback);
                }
            });
            
            _ajax(url, $.extend({ dataType: 'json', contentType: 'application/json; charset=UTF-8' }, conf));
       }
       
        var exports = { codes: httpCodes };
        [ [ 'create', 'POST' ], [ 'retrieve', 'GET' ], [ 'update', 'PUT' ], [ 'destroy', 'DELETE' ] ].forEach(function(proto) {
           exports[proto[0]] = function(/* path, [data], tests */) {
               var path = arguments[0],
                   data = (typeof arguments[1]) !== 'function' ? arguments[1] : undefined,
                   tests = (typeof arguments[1]) !== 'function' ? arguments[2] : arguments[1];
               
               return _request(_prefix(path), { method: proto[1], data: data }, tests);
           }
       });
       
       return exports;
    })('//' + serviceDomain + '/rest', {
        notFound: 404,
        ok: 200,
        created: 201
    }, 20 * 1000, true);

$.cookie.json = true;

describe('user REST integration test', function() {
    
    var authData = {
            'service' : 'facebook',
            'accessToken' : 'a1'
        };
    
    $.cookie('auth', { service: authData.service, accessToken: authData.accessToken }, { path: '/' });
    
    var proto = {
            'firstName' : 'a',
            'lastName' : 'b'
        },
        currentRest = '/user';
    
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
   
    it('should be POST rest which creates first user entry', function() {
        rest.create(currentRest, proto,
           function(successCallback, errorCallback) {
                expect(errorCallback).not.toHaveBeenCalled();
                expect(successCallback).toHaveBeenCalled();
              
                proto.id = 1;
                proto.gender = 'unknown';
                proto.site = '';
                proto.authService = authData.service;
              
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

describe('offer template REST integration test', function() {

    var authData = {
            'service' : 'facebook',
            'accessToken' : 'a2'
        };
    
    $.cookie('auth', { service: authData.service, accessToken: authData.accessToken }, { path: '/' });

    it('should be POST rest which prepares user entry', function() {
        rest.create('/user', {
            'firstName' : 'c',
            'lastName' : 'd'
        });
    });

    var proto = {
            'title' : 'test title',
            'description' : 'lorem ipsum dolor sit amet',
            'recipe' : 'http://xxx.aaa.com/test-title'
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
              
                proto.id = 1;
              
                var response = successCallback.mostRecentCall.args[0];
                expect(response).toBeDefined();
                expect(response).toEqual(proto);

                var status = successCallback.mostRecentCall.args[1];
                expect(status).toEqual(rest.codes.ok);
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