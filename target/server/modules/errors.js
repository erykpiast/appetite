var Util = $require('util');

var protos = {
		'Internal' : {
			status: 500,
			msg: 'Internal server error',
			descriptions: {
				'DATABASE': 'Reading database failed',
				'CONCURRENCY': 'Interfering request is being processed'
			}
		},
		'Authentication' : {
			status: 401,
			msg: 'Authentication failed',
			descriptions: {
				'INVALID_ACCESSTOKEN': 'Access token is not valid',
				'UNKNOWN_SERVICE': 'Attempted use of not supported authentication service'
			}
		},
		'WrongData' : {
			status: 400,
			msg: 'Wrong data format',
			descriptions: {
				'ENTITY_EXISTS': 'Entity already exists'
			}
		},
		'NotFound' : {
			status: 404,
			msg: 'Resource not found',
			descriptions: {
				
			}
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
	var error = module.exports[errorName] = function(descriptionCode) {
		this.httpStatus = protos[errorName].status;
		console.error(protos[errorName].msg + (descriptionCode && descriptionCode.length ? ' | ' + protos[errorName].descriptions[descriptionCode] : ''));
		return error.super_.call(this, protos[errorName].msg + (descriptionCode && descriptionCode.length ? ' | ' + protos[errorName].descriptions[descriptionCode] : ''), this.constructor);
	};
	Util.inherits(error, AbstractError);
	error.prototype.name = errorName;
});

module.exports.report = function(errName, descriptionCode) {
    return function(prevErr) {
        if(module.exports[errName] && !(prevErr instanceof module.exports.Generic)) {
            throw new module.exports[errName](protos[errName].descriptions[descriptionCode]);
        } else {
            throw prevErr;
        }
    };
};