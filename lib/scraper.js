/* eslint-disable prefer-object-spread */
const htmlparser2 = require('htmlparser2');
const { NCORE_URL } = require('./defaults.js');
const makeClient = require('./ncore_client');
const makeListParser = require('./crawlers/list_page');
const makeDetailParser = require('./crawlers/detail_page');
const makeVersionsParser = require('./crawlers/versions_page');
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
      const detailStream = client.getTorrents(client.getMoviesQuery(filters));

      return new Promise(resolve => {
        const parser = new htmlparser2.Parser(listPageParser, {
          decodeEntities: true,
        });

        detailStream.on('data', chunk => {
          parser.write(chunk);
        });

        detailStream.on('end', () => {
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
      const otherVersionParser = makeVersionsParser();
      const detailStream = client.getTorrents(client.getMovieQuery(id));

      return new Promise(resolve => {
        const parser = new htmlparser2.Parser(detailPageParser, {
          decodeEntities: true,
        });

        detailStream.on('data', chunk => {
          parser.write(chunk);
        });

        detailStream.on('end', () => {
          parser.end();
          const detailPageResult = detailPageParser.getResults();
          const otherVersionsStream = client.getAjax(
            client.queryVersion(detailPageResult)
          );

          const versionParser = new htmlparser2.Parser(otherVersionParser, {
            decodeEntities: true,
          });

          otherVersionsStream.on('data', chunk => {
            versionParser.write(chunk);
          });

          otherVersionsStream.on('end', () => {
            versionParser.end();
            resolve(
              Object.assign(
                {},
                detailPageParser.getResults(),
                otherVersionParser.getResults()
              )
            );
          });
        });
      });
    },
  };
};
