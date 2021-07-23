const htmlparser2 = require('htmlparser2');
const createClient = require('./ncore_client');
const makeListParser = require('./crawlers/list_page');
const makeDetailParser = require('./crawlers/detail_page');
const makeVersionsParser = require('./crawlers/versions_page');
const { combiner } = require('./helpers');

module.exports = async function makeScraper(options = {}) {
  const { username, password, url = 'https://ncore.pro' } = options;
  const client = await createClient({
    url,
    username,
    password,
  });

  return {
    getMovies(filters) {
      const listPageParser = makeListParser();
      const detailStream = client.getTorrents(client.getMoviesQuery(filters));

      return new Promise((resolve, reject) => {
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
        detailStream.on('error', error => {
          reject(error);
        });
      });
    },
    getMovie(id) {
      const detailPageParser = makeDetailParser();
      const detailStream = client.getTorrents(client.getMovieQuery(id));
      return new Promise((resolve, reject) => {
        const parser = new htmlparser2.Parser(detailPageParser, {
          decodeEntities: true,
        });

        detailStream.on('data', chunk => {
          parser.write(chunk);
        });

        detailStream.on('error', error => {
          reject(error);
        });

        detailStream.on('end', () => {
          parser.end();
          const { imdbId } = detailPageParser.getResults();
          const otherVersionsStream = client.getAjax(
            client.queryVersion({ id, imdbId: imdbId.replace('tt', '') })
          );
          const details = detailPageParser.getResults();
          const otherVersionParser = makeVersionsParser(details);
          const versionParser = new htmlparser2.Parser(otherVersionParser, {
            decodeEntities: true,
          });

          otherVersionsStream.on('data', chunk => {
            versionParser.write(chunk);
          });

          otherVersionsStream.on('error', error => {
            reject(error);
          });

          otherVersionsStream.on('end', () => {
            versionParser.end();
            resolve({
              ...details,
              ...otherVersionParser.getResults(),
            });
          });
        });
      });
    },
    getTorrentFile: id => client.getTorrents(client.getTorrentFileQuery(id)),
    getMovieByImdb(id) {
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
          const {
            torrentIds,
            ids,
            urls,
            titles,
            times,
            sizes,
            languages,
            qualities,
          } = listPageParser.getResults();
          const combined = combiner(
            [
              'id',
              'imdbId',
              'imdbUrl',
              'title',
              'last_modified',
              'size',
              'language',
              'quality',
            ],
            torrentIds,
            ids,
            urls,
            titles,
            times,
            sizes,
            languages,
            qualities
          );
          resolve({
            ...combined[0],
            versions: combined,
          });
        });
        listStream.on('error', error => {
          reject(error);
        });
      });
    },
  };
};
