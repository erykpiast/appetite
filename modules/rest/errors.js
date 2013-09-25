var Util = $require('util');

var protos = {
		'Database' : {
			status: 500,
			msg: 'Reading database failed'
		},
		'Authentication' : {
			status: 401,
			msg: 'Authentication failed'
		},
		'WrongData' : {
			status: 400,
			msg: 'Wrong data format'
		},
		'NotFound' : {
			status: 404,
			msg: 'Not found'
		}
	};
	
function AbstractError(msg, constr) {
	Error.captureStackTrace(this, (constr || this));
	this.message = (msg || 'Some error occured');
}
Util.inherits(AbstractError, Error);
AbstractError.prototype.name = 'Abstract Error';

module.exports['Generic'] = AbstractError;
Object.keys(protos).forEach(function(errorName) {
	var error = module.exports[errorName] = function(msg) {
		this.httpStatus = protos[errorName].status;
		return error.super_.call(this, (msg || protos[errorName].msg), this.constructor);
	};
	Util.inherits(error, AbstractError);
	error.prototype.name = errorName;
});

module.exports.report = function(errName) {
    return function(prevErr) {
        if(module.exports[errName] && !(prevErr instanceof module.exports.Generic)) {
            throw new module.exports[errName]();
        } else {
            throw prevErr;
        }
    };
};