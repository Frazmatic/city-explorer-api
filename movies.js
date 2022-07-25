/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const axios = require('axios').default;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const movieCache = {};

class Movies {
  constructor(title, overview, averageVotes, totalVotes, imageUrl, popularity, releasedOn) {
    this.title = title;
    this.overview = overview;
    this.average_votes = averageVotes;
    this.total_votes = totalVotes;
    this.image_url = imageUrl;
    this.popularity = popularity;
    this.released_on = releasedOn;
  }

  static daysLimitExceed(lastRetrieved, limit) {
    return (Date.now() - lastRetrieved)/(1000*3600*24) > limit;
  }

  static async fetchMovies(cityName) {
    console.log('fetching new data from remote API');
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${cityName}&include_adult=false`;
    return this.makeMoviesList(await axios.get(url));
  }

  static async getMovies(cityExplorerRequest, cityExplorerRes) {
    const cityName = cityExplorerRequest.query.city_name;
    try {
      if (!(cityName in movieCache) || Movies.daysLimitExceed(movieCache[cityName].lastRetrieved, 1)) {
        movieCache[cityName] = {movies: await Movies.fetchMovies(cityName), lastRetrieved: Date.now()};
      }
      cityExplorerRes.send(movieCache[cityName].movies);
    } catch (error) {
      cityExplorerRes.status(400).send('City not found in movie data: ' + error);
    }
  }

  static makeMoviesList(TMDBResponse) {
    const movies = TMDBResponse.data.results.map((movie) => {
      return new Movies(movie.original_title,
          movie.overview,
          movie.vote_average,
          movie.vote_count,
          'https://image.tmdb.org/t/p/w500' + movie.poster_path,
          movie.popularity,
          movie.release_date);
    });
    return movies;
  }
}

module.exports = Movies.getMovies;
