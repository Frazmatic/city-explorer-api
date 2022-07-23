/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

require('dotenv').config();
const PORT = process.env.PORT;

const Forecast = require('./weather');
const getMovies = require('./movies');

const express = require('express');
const server = express();

const cors = require('cors');
server.use(cors());


// weather endpoint
server.get('/weather', (req, res) => {
  Forecast.getForecasts(req.query.lat, req.query.lon, res);
});

// movies endpoint
server.get('/movies', getMovies);

server.listen(PORT, () => {
  console.log('Server is running on port :: ' + PORT);
});
