const got = require('got');
const { URLSearchParams } = require('url');
const authenticator = require('./plugins/authenticator');
const userAgent = require('./plugins/user_agent');
const cookieHandler = require('./plugins/cookie');
const FormData = require('form-data');

const DOWNLOAD_KEY = 'cc2b49f6937425b2b87003405cc46009';
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

module.exports = function makeClient({ url, username, password }) {
  const instance = got.extend(
    cookieHandler,
    authenticator({
      username,
      password,
    }),
    userAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36'
    ),
    {
      prefixUrl: url,
      followRedirect: false,
    }
  );

  return {
    getTorrents: ({ searchParams, body }) => {
      const request = body
        ? instance.stream.post.bind(instance)
        : instance.stream.get.bind(instance.stream);
      return request('torrents.php', { searchParams, body });
    },
    getMoviesQuery: filters => {
      const query = {
        searchParams: new URLSearchParams([
          ['csoport_listazas', 'osszes_film'],
        ]),
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
    },
    getMovieQuery: (id = '') => {
      const query = {
        searchParams: new URLSearchParams([['action', 'details']]),
      };
      try {
        const appendParam = query.searchParams.append.bind(query.searchParams);
        appendParam('id', id);
        return query;
      } catch (error) {
        console.dir(error);
      } finally {
        return query;
      }
    },
    queryVersion: ({ id, torrentId }) => {
      const query = {
        searchParams: new URLSearchParams([['action', 'other_versions']]),
      };
      try {
        const appendParam = query.searchParams.append.bind(query.searchParams);
        appendParam('id', id);
        appendParam('fid', torrentId);
        return query;
      } catch (error) {
        console.dir(error);
      } finally {
        return query;
      }
    },
    getAjax: ({ searchParams }) => {
      const request = instance.stream.get.bind(instance.stream);
      return request('ajax.php', { searchParams });
    },
    getTorrentFileQuery: (id = '') => {
      const query = {
        searchParams: new URLSearchParams([['action', 'download']]),
      };
      try {
        const appendParam = query.searchParams.append.bind(query.searchParams);
        appendParam('id', id);
        appendParam('key', DOWNLOAD_KEY);
        return query;
      } catch (error) {
        console.dir(error);
      } finally {
        return query;
      }
    },
    getMovieByImdbQuery: id => {
      const query = {
        body: new FormData(),
      };

      try {
        const appendParam = query.body.append.bind(query.body);
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
        appendParam('tipus', 'kivalasztottak_kozott');
        appendParam('kivalasztott_tipus', TYPES.join(','));
        appendParam('miben', 'imdb');
        appendParam('tags', '');
        appendParam('mire', id);
        return query;
      } catch (error) {
        console.dir(error);
      } finally {
        return query;
      }
    },
  };
};
