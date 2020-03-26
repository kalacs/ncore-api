const htmlparser2 = require('htmlparser2');
const { URLSearchParams } = require('url');
const { NCORE_URL } = require('./defaults.js');
const makeClient = require('./ncore_client');
const findTitle = require('./scraper_queries/find_title');
const findIMDBId = require('./scraper_queries/find_id');
const findIMDBUrl = require('./scraper_queries/find_url');
const findUploadTime = require('./scraper_queries/find_upload_datetime');
const findTorrentId = require('./scraper_queries/find_torrent_id');

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

const mapSortName = param => {
  return {
    title: 'name',
    uploaded: 'fid',
    size: 'size',
    downloaded_times: 'times_completed',
    seeders: 'seeders',
    leechers: 'leechers',
  }[param];
};

const createSortParam = ({ sortBy = 'uploaded' }) => [
  `miszerint`,
  mapSortName(sortBy),
];
const createSortDirectionParam = ({ sortDirection = 'DESC' }) => [
  `hogyan`,
  sortDirection,
];
const getMovieQuery = filters => {
  const query = {
    searchParams: new URLSearchParams([['csoport_listazas', 'osszes_film']]),
  };
  try {
    const appendParam = query.searchParams.append.bind(query.searchParams);
    const { genres = [] } = filters;
    const TYPES = [
      'xvid_hun',
      'xvid',
      'dvd_hun',
      'dvd',
      'dvd9',
      'dvd9_hun',
      'hd_hun',
      'hd',
    ];
    appendParam(...createSortParam(filters));
    appendParam(...createSortDirectionParam(filters));
    appendParam('tipus', 'kivalasztottak_kozott');
    appendParam('kivalasztott_tipus', TYPES.join(','));
    appendParam('tags', genres.join(','));
    return query;
  } catch (error) {
    console.dir(error);
  } finally {
    return query;
  }
};

module.exports = function makeScraper(options = {}) {
  const { username, password } = options;
  const client = makeClient({
    url: NCORE_URL,
    username,
    password,
  });

  return {
    getMovies: async filters => {
      const readableStream = client.getTorrents(getMovieQuery(filters));

      return new Promise(resolve => {
        const titles = [];
        const ids = [];
        const urls = [];
        const times = [];
        const torrentId = [];
        const titleFinder = findTitle(titles);
        const imdbIdFinder = findIMDBId(ids);
        const imdbUrlFinder = findIMDBUrl(urls);
        const uploadTimeFinder = findUploadTime(times);
        const torrentIdFinder = findTorrentId(torrentId);
        const parser = new htmlparser2.Parser(
          {
            onopentag(name, attribs) {
              titleFinder.onopentag(name, attribs);
              imdbIdFinder.onopentag(name, attribs);
              imdbUrlFinder.onopentag(name, attribs);
              uploadTimeFinder.onopentag(name, attribs);
              torrentIdFinder.onopentag(name, attribs);
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
              ['id', 'imdbId', 'imdbUrl', 'title', 'last_modified'],
              torrentId,
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
