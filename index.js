/* eslint-disable no-console */
require('dotenv').config();
const makeScraper = require('./lib/scraper');

// get latest movies
(async () => {
  try {
    const scraper = makeScraper({
      username: process.env.NCORE_NICK,
      password: process.env.NCORE_PASSHASH,
      type: 'ncore',
    });
    const movies = await scraper.getMovies();
    console.dir(movies);
  } catch (error) {
    console.dir(error);
  }
})();
