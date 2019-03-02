const patternDict=require('../patterns');
const XRegExp = require ('xregexp');

let matcherFunction = (str , cb) => {
	let getResult = patternDict.find ( item => {
		if( XRegExp.test (str , XRegExp ( item.pattern , "i"))){
			return true ;
		}
	});

	if( getResult ){
		return cb ({
			intent : getResult.intent,
			entities : createEntities(str, getResult.pattern)
		});
	}
	else {
		return cb ({}) ;
	}
}

let createEntities = (str, pattern) => {
	return XRegExp.exec(str , XRegExp (pattern , "i"))
}
module.exports = matcherFunction;