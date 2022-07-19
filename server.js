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
}

// weather endpoint
server.get('/weather', (req, res) => {
  const queries = req.query;
  const city = weather.find((el) => {
    return (
      queries.city_name === el.city_name &&
      queries.lat === el.lat &&
      queries.lon === el.lon
    );
  });

  const forecasts = city.data.map((d) => {
    const date = d.valid_date;
    const description =
      `Low of ${d.low_temp}, ` +
      `high of ${d.high_temp} ` +
      `with ${d.weather.description}`;
    return new Forecast(date, description);
  });

  if (city) {
    res.send(forecasts);
  } else {
    res.status(404).send('City not found');
  }
});

server.listen(PORT, () => {
  console.log('Server is running on port :: ' + PORT);
});
