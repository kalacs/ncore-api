const { NCORE_URL } = require('./defaults.js');

module.exports = function makeScraper(options = {}) {
  const { username, password } = options;

  return {
    getMovies: async () => {
      return {};
    },
  };
};
