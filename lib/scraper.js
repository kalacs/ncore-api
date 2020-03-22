const { NCORE_URL } = require('./defaults.js');
const makeClient = require('./ncore_client');

module.exports = function makeScraper(options = {}) {
  const { username, password } = options;
  const client = makeClient({
    url: NCORE_URL,
    username,
    password,
  });

  return {
    getMovies: async () => {
      return client.getTorrents({ genre: 'movie' });
    },
  };
};
