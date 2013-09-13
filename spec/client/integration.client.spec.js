describe('REST integration test', function() {
 
   var restPath = 'http://erykpiast.kd.io/rest';
   
   function rest(path) {
       return (restPath + path);
   }
   
   
   function ajax(url, options, successCallback, errorCallback) {
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
                
                if((req.status >= 200) && (req.status < 400)) {
                    successCallback(res, req.status, req);
                } else if(req.status >= 400) {
                    errorCallback(res, req.status, req);
                } else if(req.status === 0) {
                    console.error('Cross-domain issue!');
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
        
        req.send(options.data);
   }
   
   
   function testAjaxCall(url, conf, tests) {
        var successCallback = jasmine.createSpy(),
            errorCallback = jasmine.createSpy();
       
        ajax(url, $.extend({ dataType: 'json', contentType: 'application/json; charset=UTF-8' }, conf), successCallback, errorCallback);
       
        waitsFor(function() {
            return (successCallback.callCount > 0) || (errorCallback.callCount > 0);
        }, 'The Ajax call timed out', 1000);
       
        runs(function() {
            tests.call(null, successCallback, errorCallback);
        });
   }
   
    beforeEach(function() {
        this.addMatchers({
            toBeLessThan: function(expected) {
              return this.actual < expected;
            }
        });
    });
   
   
   it('should be user POST rest which creates user in database', function() {
       
        testAjaxCall(
            rest('/user'),
            {
                method: 'POST',
                data: {
                    'authService' : 'facebook',
                    'accessToken' : 'a1',
                    'firstName' : 'a',
                    'lastName' : '1'
                }
            },
           function(successCallback, errorCallback) {
                expect(errorCallback).not.toHaveBeenCalled();
                expect(successCallback).toHaveBeenCalled();
              
                var response = successCallback.mostRecentCall.args[0];
                expect(response).toBeDefined();
                expect(response.msg).toEqual({
                    'authService' : 'facebook',
                    'accessToken' : 'a1',
                    'firstName' : 'a',
                    'lastName' : '1',
                    'gender' : 'unknown',
                    'site' : ''
                });
           }
        );
        
   });
   
   
   it('should be user GET rest with no users', function() {
       
        testAjaxCall(
           rest('/user/1'),
           { method: 'GET' },
           function(successCallback, errorCallback) {
                expect(successCallback).not.toHaveBeenCalled();
                expect(errorCallback).toHaveBeenCalled();
              
                var response = errorCallback.mostRecentCall.args[0];
                expect(response).toBeDefined();
                expect(response.msg).toBeDefined();
           }
        );
        
   });
    
});