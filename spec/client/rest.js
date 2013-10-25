define([], function() {
  
  return (function(_pathPrefix, _httpCodes, _waitingTime, _log) {

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
    }, 20 * 1000, !true);  
    
})