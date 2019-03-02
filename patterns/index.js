const patternDict = [
{
	pattern : '(?<weather>sunny |rainy |cloudy |good |cold |hot )?in '
	 +'(?<city>\\w+ ?\\w+[^the][^tomorrow][^today]) ((the )?(?<time>((\\w+ )+)?tomorrow))?',
	intent : 'Get Weather'
},
{
	pattern : '\\b(?<greeting>Hi|Hello|Hey)\\b',
	intent : 'Hello'
},
{
	pattern :'\\b(?<exit>bye|exit)\\b',
	intent : 'Exit'
}];

module.exports = patternDict ;