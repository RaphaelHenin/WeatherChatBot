"use strict ";
const axios = require ("axios");
const apikey = "db251f77596743cb987211855191202";

const getWeather = location => {
  return new Promise(async (resolve, reject) => {
    try {
      const weatherConditions = await axios.get(
        "http://api.apixu.com/v1/forecast.json", {
          params: {
            key: apikey,
            q: location,
            days: 3
          }
        });

      resolve(weatherConditions.data)
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = getWeather;