/* eslint-disable no-console */
const makeScraper = require('./lib/scraper');

/*
const scraper = makeScraper({
  username: process.env.NCORE_NICK,
  password: process.env.NCORE_PASSHASH,
  type: 'ncore',
});
*/
module.exports = makeScraper;
