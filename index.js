/* eslint-disable no-console */
require('dotenv').config();
const makeScraper = require('./lib/scraper');

(async () => {
  try {
    const scraper = makeScraper({
      username: process.env.NCORE_NICK,
      password: process.env.NCORE_PASSHASH,
      type: 'ncore',
    });
    // get latest movies
    /*    const movies = await scraper.getMovies({
      genres: ['animáció'],
    });
*/
    const movies = await scraper.getMovie('3004223');
    console.log(movies);
  } catch (error) {
    console.dir(error);
  }
})();
