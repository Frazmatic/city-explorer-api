/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const axios = require('axios').default;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const weatherCache = {};

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }

  static daysLimitExceed(lastRetrieved, limit) {
    return (Date.now() - lastRetrieved)/(1000*3600*24) > limit;
  }

  static async fetchWeather(lat, lon) {
    console.log('fetching new data from remote API');
    const url = `https://api.weatherbit.io/v2.0/forecast/daily/?key=${WEATHER_API_KEY}&days=3&lat=${lat}&lon=${lon}`;
    return Forecast.makeForecasts(await axios.get(url));
  }

  static async getForecasts(cityExplorerRequest, cityExplorerRes) {
    const lat = parseFloat(cityExplorerRequest.query.lat).toFixed(3);
    const lon = parseFloat(cityExplorerRequest.query.lon).toFixed(3);
    const cacheKey = [lat, lon].toString();

    try {
      if (!(cacheKey in weatherCache) || Forecast.daysLimitExceed(weatherCache[cacheKey].lastRetrieved, 1)) {
        weatherCache[cacheKey] = {forecasts: await Forecast.fetchWeather(lat, lon), lastRetrieved: Date.now()};
      }
      cityExplorerRes.send(weatherCache[cacheKey].forecasts);
    } catch (error) {
      cityExplorerRes.status(400).send('City not found in weather data: ' + error);
    }
  }

  static makeForecasts(weatherbitResponse) {
    const city = weatherbitResponse.data;
    const forecasts = city.data.map((d) => {
      const date = d.valid_date;
      const description =
          `Low of ${d.low_temp}, ` +
          `high of ${d.high_temp} ` +
          `with ${d.weather.description}`;
      return new Forecast(date, description);
    });
    return forecasts;
  }
}

module.exports = Forecast.getForecasts;
