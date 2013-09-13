describe('REST integration test', function() {
   
   var restPath = 'http://erykpiast.kd.io:3000/rest';
   
   function rest(path) {
       return (restPath + path);
   }
   
   function testAjaxCall(url, conf, tests) {
        var successCallback = jasmine.createSpy(),
            errorCallback = jasmine.createSpy();
       
        $.ajax(url, $.extend({ dataType: 'json', contentType: 'application/json; charset=UTF-8' }, conf)).then(successCallback, errorCallback);
       
        waitsFor(function() {
            return (successCallback.callCount > 0) || (errorCallback.callCount > 0);
        }, 'The Ajax call timed out', 5000);
       
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
              
                var response = successCallback.mostRecentCall.args[0].responseJSON;
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
              
                console.log(errorCallback.mostRecentCall.args[0].status);
              
                var response = errorCallback.mostRecentCall.args[0].responseJSON;
                expect(response).toBeDefined();
                expect(response.msg).toBeDefined();
           }
        );
        
   });
    
});