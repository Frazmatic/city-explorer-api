/* eslint-disable require-jsdoc */
require('dotenv').config();
const weather = require('./data/weather.json');
const express = require('express');
const cors = require('cors');
const server = express();
server.use(cors());
const PORT = process.env.PORT;

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }

  static makeForecasts(city) {
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

function findCity(name, lat, lon, weatherData) {
  console.log('finding city');
  try {
    const city = weatherData.find((el) => {
      return (
        name === el.city_name &&
        // the lat & lon in our sample data and 
        // the locationiq are slightly different
        Math.round(lat) === Math.round(el.lat) &&
        Math.round(lon) === Math.round(el.lon)
      );
    });
    return city;
  } catch (err) {
    throw new Error('No City Match in Weather Data' + err);
  }
}

// weather endpoint
server.get('/weather', (req, res) => {
  const queries = req.query;
  const city = findCity(queries.city_name, queries.lat, queries.lon, weather);

  if (city) {
    res.send(Forecast.makeForecasts(city));
  } else {
    res.status(404).send('City not found in weather data');
  }
});

server.listen(PORT, () => {
  console.log('Server is running on port :: ' + PORT);
});
