/* eslint-disable no-console */
const makeScraper = require('./lib/scraper');

// get latest movies
(async () => {
  const scraper = makeScraper({ username: '', password: '', type: 'ncore' });
  const movies = await scraper.getMovies();
  console.dir(movies);
})();
