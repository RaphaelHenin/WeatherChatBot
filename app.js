"use strict";
const Readline = require('readline');//for reading inputs
const rl = Readline.createInterface({ //for reading inputs
	input: process.stdin,
	output: process.stdout,
	terminal: false
});
rl.setPrompt('> ');
rl.prompt();
rl.on('line', reply => {
    rl.setPrompt('> ');
    console.log("You said : "+reply);
    rl.prompt();
})
