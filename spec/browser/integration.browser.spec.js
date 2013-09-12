describe('REST integration test', function() {
   
   var restPath = 'http://localhost:3000/rest/';
   
   it('should be user GET rest', function() {
       
       var responseHandler = function(res) {
                expect(res).toBeDefined();
                expect(res.msg).toBeDefined();
                
                return true;
            };
       
       $.ajax(restPath + 'user/1', {
           method: 'GET'
       }).then(responseHandler, responseHandler);
       
        waitsFor();
   });
    
});