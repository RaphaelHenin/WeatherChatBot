'use strict';

if (process.env.NODE_ENV == 'production') {
    module.exports = {
        "FB": {
            "pageAccessToken": process.env.pageAccessToken,
            "VerifyToken": process.env.VerifyToken
        }
    }
}
else {
    module.exports = require('./development.json');
}

