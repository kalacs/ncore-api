const htmlparser2 = require('htmlparser2');
const { NCORE_URL } = require('./defaults.js');
const makeClient = require('./ncore_client');
const makeListParser = require('./crawlers/list_page');
const makeDetailParser = require('./crawlers/detail_page');
const { combiner } = require('./helpers');

module.exports = function makeScraper(options = {}) {
  const { username, password } = options;
  const client = makeClient({
    url: NCORE_URL,
    username,
    password,
  });

  return {
    getMovies: async filters => {
      const listPageParser = makeListParser();
      const readableStream = client.getTorrents(client.getMoviesQuery(filters));

      return new Promise(resolve => {
        const parser = new htmlparser2.Parser(listPageParser, {
          decodeEntities: true,
        });

        readableStream.on('data', chunk => {
          parser.write(chunk);
        });

        readableStream.on('end', () => {
          parser.end();
          const {
            torrentIds,
            ids,
            urls,
            titles,
            times,
          } = listPageParser.getResults();

          resolve(
            combiner(
              ['id', 'imdbId', 'imdbUrl', 'title', 'last_modified'],
              torrentIds,
              ids,
              urls,
              titles,
              times
            )
          );
        });
      });
    },
    getMovie: async id => {
      const detailPageParser = makeDetailParser();
      const readableStream = client.getTorrents(client.getMovieQuery(id));

      return new Promise(resolve => {
        const parser = new htmlparser2.Parser(detailPageParser, {
          decodeEntities: true,
        });

        readableStream.on('data', chunk => {
          parser.write(chunk);
        });

        readableStream.on('end', () => {
          parser.end();
          resolve(detailPageParser.getResults());
        });
      });
    },
  };
};
