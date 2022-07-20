/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }

  static findCity(name, lat, lon, weatherData) {
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

module.exports = Forecast;
