describe('REST integration test', function() {
   
   var restPath = 'http://localhost:3000/rest/';
   
   it('should be user GET rest', function() {
       var complete = false;
       
       $.ajax(restPath + 'user/1', {
           method: 'GET'
       }).then(
            function(res) {
                expect(res).toBeDefined();
                expect(res.msg).toBeDefined();
                
                complete = true;
            },
            function() {
                complete = true;
            }
        );
       
        waitsFor(function() {
            return !!complete;
        });
   });
    
});