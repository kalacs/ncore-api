const htmlparser2 = require('htmlparser2');
const fs = require('fs');
const { NCORE_URL } = require('./defaults.js');
const makeClient = require('./ncore_client');
const findTitle = require('./scraper_queries/find_title');
const findIMDBId = require('./scraper_queries/find_id');
const findUploadTime = require('./scraper_queries/find_upload_datetime');

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

module.exports = function makeScraper(options = {}) {
  const { username, password } = options;
  const client = makeClient({
    url: NCORE_URL,
    username,
    password,
  });

  return {
    getMovies: async () => {
      const data = {};
      const readableStream = fs.createReadStream('./list.html');

      return new Promise(resolve => {
        const titles = [];
        const ids = [];
        const times = [];
        const titleFinder = findTitle(titles);
        const imdbIdFinder = findIMDBId(ids);
        const uploadTimeFinder = findUploadTime(times);
        const parser = new htmlparser2.Parser(
          {
            onopentag(name, attribs) {
              titleFinder.onopentag(name, attribs);
              imdbIdFinder.onopentag(name, attribs);
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
            combiner(['imdbUrl', 'title', 'last_modified'], ids, titles, times)
          );
        });
      });
      //      return client.getTorrents({ genre: 'movie' });
    },
  };
};
