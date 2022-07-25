/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

require('dotenv').config();
const PORT = process.env.PORT;

const express = require('express');
const server = express();
const cors = require('cors');
server.use(cors());

const getForecasts = require('./weather');
const getMovies = require('./movies');

// weather endpoint
server.get('/weather', getForecasts);

// movies endpoint
server.get('/movies', getMovies);

server.listen(PORT, () => {
  console.log('Server is running on port :: ' + PORT);
});
