const htmlparser2 = require('htmlparser2');
const fs = require('fs');
const { NCORE_URL } = require('./defaults.js');
const makeClient = require('./ncore_client');
const findTitle = require('./scraper_queries/find_title');
const findIMDBId = require('./scraper_queries/find_id');
const findIMDBUrl = require('./scraper_queries/find_url');
const findUploadTime = require('./scraper_queries/find_upload_datetime');
const { URLSearchParams } = require('url');

const combiner = (fields, ...arrays) => {
  const [firstArray] = arrays;

  return firstArray.reduce((acc, _, row) => {
    const object = {};
    fields.forEach((value, index) => {
      object[value] = arrays[index][row];
    });
    acc.push(object);
    return acc;
  }, []);
};

const getMovieQuery = () =>
  new URLSearchParams([['csoport_listazas', 'osszes_film']]);

module.exports = function makeScraper(options = {}) {
  const { username, password } = options;
  const client = makeClient({
    url: NCORE_URL,
    username,
    password,
  });

  return {
    getMovies: async () => {
      const readableStream = client.getTorrents(getMovieQuery());

      return new Promise(resolve => {
        const titles = [];
        const ids = [];
        const urls = [];
        const times = [];
        const titleFinder = findTitle(titles);
        const imdbIdFinder = findIMDBId(ids);
        const imdbUrlFinder = findIMDBUrl(urls);
        const uploadTimeFinder = findUploadTime(times);
        const parser = new htmlparser2.Parser(
          {
            onopentag(name, attribs) {
              titleFinder.onopentag(name, attribs);
              imdbIdFinder.onopentag(name, attribs);
              imdbUrlFinder.onopentag(name, attribs);
              uploadTimeFinder.onopentag(name, attribs);
            },
            ontext(text) {
              titleFinder.ontext(text);
              uploadTimeFinder.ontext(text);
            },
            onclosetag(name) {
              uploadTimeFinder.onclosetag(name);
            },
          },
          { decodeEntities: true }
        );

        readableStream.on('data', chunk => {
          parser.write(chunk);
        });

        readableStream.on('end', () => {
          parser.end();
          resolve(
            combiner(
              ['imdbId', 'imdbUrl', 'title', 'last_modified'],
              ids,
              urls,
              titles,
              times
            )
          );
        });
      });
    },
  };
};
