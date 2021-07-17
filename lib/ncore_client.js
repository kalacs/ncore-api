const { URLSearchParams } = require('url');
const FormData = require('form-data');
const {
  createSortParam,
  createSortDirectionParam,
  createHttpClient,
} = require('./helpers');

const DOWNLOAD_KEY = 'cc2b49f6937425b2b87003405cc46009';

module.exports = async function createProviderClient({
  url,
  username,
  password,
}) {
  const { get, post } = await createHttpClient({ url, username, password });

  return {
    getTorrents: ({ searchParams, body }) => {
      const request = body ? post : get;
      return request('torrents.php', { searchParams, body });
    },
    getMoviesQuery: (filters = { genres: [], sortBy: 'uploaded' }) => {
      const query = {
        searchParams: new URLSearchParams([
          ['csoport_listazas', 'osszes_film'],
        ]),
      };
      try {
        const appendParam = query.searchParams.append.bind(query.searchParams);
        const { genres } = filters;
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
        return query;
      }
    },
    getAjax: ({ searchParams }) => get('ajax.php', { searchParams }),
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
        return query;
      }
    },
  };
};
