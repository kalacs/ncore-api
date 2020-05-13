/* eslint-disable object-shorthand */
/* eslint-disable func-names */
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
    getMovies: async function(filters) {
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
    getMovie: async function(id) {
      const detailPageParser = makeDetailParser();
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
          const details = detailPageParser.getResults();
          const otherVersionParser = makeVersionsParser(details);
          const versionParser = new htmlparser2.Parser(otherVersionParser, {
            decodeEntities: true,
          });

          otherVersionsStream.on('data', chunk => {
            versionParser.write(chunk);
          });

          otherVersionsStream.on('end', () => {
            versionParser.end();
            resolve(
              Object.assign({}, details, otherVersionParser.getResults())
            );
          });
        });
      });
    },
    getTorrentFile: id => client.getTorrents(client.getTorrentFileQuery(id)),
    getMovieByImdb: async function(id) {
      const listPageParser = makeListParser();
      const listStream = client.getTorrents(client.getMovieByImdbQuery(id));

      return new Promise((resolve, reject) => {
        const parser = new htmlparser2.Parser(listPageParser, {
          decodeEntities: true,
        });

        listStream.on('data', chunk => {
          parser.write(chunk);
        });

        listStream.on('end', () => {
          parser.end();
          const { torrentIds } = listPageParser.getResults();
          const [firstId] = torrentIds;
          this.getMovie(firstId)
            .then(resolve)
            .catch(reject);
        });
      });
    },
  };
};
