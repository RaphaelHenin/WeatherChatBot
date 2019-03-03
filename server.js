'use strict';

const express = require("express");
const config = require("./config");
const fbeamer = require("./FBeamer");
const bodyParser = require('body-parser')

const server = express();
const PORT = process.env.PORT || 3000;


console.log(config.FB.PageAccessToken, config.FB.VerifyToken);
const fb = new fbeamer(config.FB);

server.get('/', (req, res, next) => {
    fb.registerHook(req, res);
    return next();
});
server.listen(PORT, () => console.log(`The bot server is running on port ${PORT}`));
// body-parser is the first Express middleware.
server.use(bodyParser.json({ verify: fb.verifyRequest }));
server.use(fb.incoming);
server.use(fb.abortOnError);
server.post('/webhook', function (req, res) {
    res.status(200).send("done!");
});