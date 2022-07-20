/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

require('dotenv').config();
const PORT = process.env.PORT;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const weatherData = require('./data/weather.json');
const Forecast = require('./Forecast');

const express = require('express');
const server = express();

const cors = require('cors');
server.use(cors());
const axios = require('axios').default;

// weather endpoint
server.get('/weather', (req, res) => {
  const city = Forecast.findCity(req.query.city_name, req.query.lat, req.query.lon, weatherData);

  if (city) {
    res.send(Forecast.makeForecasts(city));
  } else {
    res.status(404).send('City not found in weather data');
  }
});

// other error handling
server.use('*', (error, request, response) => {
  response.send(500).send(error + 'bad request to frazer-city-explorer-api.');
});

server.listen(PORT, () => {
  console.log('Server is running on port :: ' + PORT);
});
