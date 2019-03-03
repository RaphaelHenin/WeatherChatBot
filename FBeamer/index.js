
'use strict';
const crypto = require('crypto');
const config = require("../config");
const request = require('request');
const matcherFunction = require('../matcher');
const weather = require('../weather');
const chalk = require('chalk');

class FBeamer {
    constructor({ PageAccessToken, VerifyToken }) {
        try {
            console.log(PageAccessToken, VerifyToken);
            if (PageAccessToken && VerifyToken) {
                this.PageAccessToken = PageAccessToken;
                this.VerifyToken = VerifyToken;
                this.app_secret = "59149ad091d02ad77ecd46fb198ac942";
            }
            else {
                throw "One or more tokens are not defined"
            }

        }
        catch{
            console.log("No parameters");
        }
    }

    static sendTxt(idSender, messageSender) {
        var headers = {
            'Content-Type': 'application/json'
        };

        var dataString = '{"messaging_type": "RESPONSE", "recipient": {"id": ' + idSender + '},"message": {"text": "' + messageSender + '" }}';

        var options = {
            url: 'https://graph.facebook.com/v2.6/me/messages?access_token=' + config.FB.PageAccessToken,
            method: 'POST',
            headers: headers,
            body: dataString
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
        }
        request(options, callback);
    }

    static sendImg(idSender) {
        var headers = {
            'Content-Type': 'application/json'
        };

        var dataString = '{"messaging_type": "RESPONSE", "recipient": {"id": ' + idSender + '},"message": {"attachment" :{"type" :"image", "payload" :{"url" : "http://al-taiclub.com/images/donald-trumpfunny-clipart-8.jpg", "is_reusable":true}}}}';

        var options = {
            url: 'https://graph.facebook.com/v2.6/me/messages?access_token=' + config.FB.PageAccessToken,
            method: 'POST',
            headers: headers,
            body: dataString
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
        }
        request(options, callback);
    }

    static testWeather(weatherAsked, dayAsked) {
        if ((dayAsked.condition.text).includes(weatherAsked.replace(" ", "")))
            return "Yes ! ";
        else
            return "No ! ";
    }

    incoming(req, res, cb) {
        // Extract the body of the POST request
        let data = req.body;
        var id;
        var timeOfMessage;
        var message;
        let messageToSend = "";
        if (data.object === "page") {
            // Iterate through the page entry Array
            data.entry.forEach(pageObj => {
                // Iterate through the messaging Array
                id = pageObj.messaging[0].sender.id;
                console.log(pageObj.messaging[0].sender);
                timeOfMessage = pageObj.messaging[0].timestamp;
                console.log(pageObj.messaging[0].timestamp);
                message = pageObj.messaging[0].message.text;
                console.log(pageObj.messaging[0].message.text);
            });
        }
        matcherFunction(message, cb => {
            switch (cb.intent) {
                case "Exit":
                    console.log("Bye, have a nice day !");
                    messageToSend = "Bye, have a nice day !";
                    FBeamer.sendTxt(id, messageToSend);
                    res.status(200).send('{"messaging_type": "RESPONSE", "recipient": {"id": ' + id + '},"message": {"text": "' + messageToSend + '" }}')
                    break;
                case "Hello":
                    console.log("Hello there !");
                    messageToSend = "Hello there !";
                    FBeamer.sendTxt(id, messageToSend);
                    res.status(200).send('{"messaging_type": "RESPONSE", "recipient": {"id": ' + id + '},"message": {"text": "' + messageToSend + '" }}')
                    break;
                case "Get Weather":
                    var city = cb.entities.city;
                    var time = cb.entities.time;
                    weather(city).then(data => {
                        var tempC = data.current.temp_c;
                        var country = data.location.country;
                        switch (time) {
                            case "tomorrow":
                                var tomorrow = data.forecast.forecastday[1];
                                if (cb.entities.weather !== undefined) {
                                    var weather = cb.entities.weather;
                                    console.log(FBeamer.testWeather(weather, tomorrow.day));
                                    messageToSend = FBeamer.testWeather(weather, tomorrow.day);
                                };
                                console.log("Information about weather tomorrow in "
                                    + chalk.white(city) + ", " + chalk.grey(country) + ". The temperature is between "
                                    + chalk.blue(tomorrow.day.mintemp_c) + " and " + chalk.red(tomorrow.day.maxtemp_c) +
                                    " degrees Celsius"
                                );
                                messageToSend += ("Information about weather tomorrow in "
                                    + city + ", " + country + ". The temperature is between "
                                    + tomorrow.day.mintemp_c + " and " + tomorrow.day.maxtemp_c +
                                    " degrees Celsius");
                                break;
                            case "day after tomorrow":
                                var dayAfterTomorrow = data.forecast.forecastday[2];
                                if (cb.entities.weather !== undefined) {
                                    var weather = cb.entities.weather;
                                    console.log(FBeamer.testWeather(weather, dayAfterTomorrow.day));
                                    messageToSend = FBeamer.testWeather(weather, dayAfterTomorrow.day);
                                }
                                console.log("Information about weather the day after tomorrow in "
                                    + chalk.white(city) + ", " + chalk.grey(country) +
                                    ". The temperature is between " + chalk.blue(dayAfterTomorrow.day.mintemp_c) +
                                    " and " + chalk.red(dayAfterTomorrow.day.maxtemp_c) + " degrees Celsius"
                                );
                                messageToSend += ("Information about weather the day after tomorrow in "
                                    + city + ", " + country +
                                    ". The temperature is between " + dayAfterTomorrow.day.mintemp_c +
                                    " and " + dayAfterTomorrow.day.maxtemp_c + " degrees Celsius"
                                );
                                break;
                            default:
                                if (cb.entities.weather !== undefined) {
                                    var weather = cb.entities.weather;
                                    console.log(FBeamer.testWeather(weather, data.current));
                                    messageToSend = FBeamer.testWeather(weather, data.current);
                                }
                                if (tempC < 0) {
                                    console.log("it is " + chalk.blue("very cold") + " in "
                                        + chalk.white(cb.entities.city) + ", " + chalk.grey(country) +
                                        ". With " + chalk.blue(tempC) + " degrees Celsius"
                                    );
                                    messageToSend += ("it is very cold in " + cb.entities.city + ", " + country +
                                        ". With " + tempC + " degrees Celsius"
                                    );
                                }
                                else if (tempC > 25) {
                                    console.log("it is " + chalk.red("hot") + " in "
                                        + chalk.white(cb.entities.city) + ", " + chalk.grey(country) +
                                        ". With " + chalk.red(tempC) + " degrees Celsius"
                                    );
                                    messageToSend += ("it is hot in "
                                        + cb.entities.city + ", " + country +
                                        ". With " + tempC + " degrees Celsius"
                                    );
                                }
                                else {
                                    console.log("it is " + chalk.green("good") + " in "
                                        + chalk.white(cb.entities.city) + ", " + chalk.grey(country) +
                                        ". With " + chalk.green(tempC) + " degrees Celsius"
                                    );
                                    messageToSend += "it is good in " + cb.entities.city + ", " + country + ". With " + tempC + " degrees Celsius";
                                }
                        }
                        FBeamer.sendTxt(id, messageToSend);
                        res.status(200).send('{"messaging_type": "RESPONSE", "recipient": {"id": ' + id + '},"message": {"text": "' + messageToSend + '" }}')
                    });
                    break;
                default:
                    console.log("Sorry but I don't understand");
                    messageToSend = "Sorry but I don't understand";
                    FBeamer.sendTxt(id, messageToSend);
                    res.status(200).send('{"messaging_type": "RESPONSE", "recipient": {"id": ' + id + '},"message": {"text": "' + messageToSend + '" }}')
            }
        });
    }

    // Verify function compatible with body-parser to retrieve the request payload.
    // Read more: https://github.com/expressjs/body-parser#verify
    verifyRequest(req, res, buf, encoding) {
        var expected = req.headers['x-hub-signature'];
        // Calculate the X-Hub-Signature header value.
        var hmac = crypto.createHmac("sha1", "59149ad091d02ad77ecd46fb198ac942");
        hmac.update(buf, "utf-8");
        var calculated = "sha1=" + hmac.digest("hex");
        console.log("X-Hub-Signature:", expected, "Content:", "-" + buf.toString('utf8') + "-");
        if (expected !== calculated) {
            throw new Error("Invalid signature.");
        } else {
            console.log("Valid signature!");
        }
    }

    // Express error-handling middleware function.
    // Read more: http://expressjs.com/en/guide/error-handling.html
    abortOnError(err, req, res, next) {
        if (err) {
            console.log(err);
            res.status(400).send({ error: "Invalid signature." });
        } else {
            next();
        }
    }

    registerHook(req, res) {
        const params = req.query;
        console.log(req.query)
        const mode = params['hub.mode'],
            token = params['hub.verify_token'],
            challenge = params['hub.challenge'];
        try {
            console.log(token);
            // if mode === 'subscribe ' and token === verifytoken , then send back challenge
            if (mode == 'subscribe' && token == this.VerifyToken) {
                // print here that webhook is registered
                return res.send(challenge);
            } else {
                throw "Could not register webhook !";
                return res.sendStatus(200);
            }
        } catch (e) {
            console.log(e);
        }
    }

}

module.exports = FBeamer;