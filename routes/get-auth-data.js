module.exports = function(req) {
    var data = {
            service: undefined,
            accessToken: undefined
        };
    
    if(req.cookies.auth) {
        try {
            var cookie = JSON.parse(req.cookies.auth);
            
            data.service = cookie.service;
            data.accessToken = cookie.accessToken;
        } catch(e) {
            console.warn('Somebody send malversed auth cookie! ' + req.cookies.auth);
        }
    }
    
    return data;
};