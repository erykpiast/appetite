module.exports = function(req) {
    var data = {
            service: undefined,
            userId: undefined,
            accessToken: undefined
        };
    
    if(req.cookies.auth) {
        try {
            var cookie = JSON.parse(req.cookies.auth);
            
            data.service = cookie.service;
            data.userId = cookie.userId;
            data.accessToken = cookie.accessToken;
        } catch(e) {
            console.warn('Somebody send malversed auth cookie! ' + req.cookies.auth);
        }
    } else {
        data.service = req.body.authService;
        data.userId = req.body.userId;
        data.accessToken = req.body.accessToken;
    }
    
    return data;
};