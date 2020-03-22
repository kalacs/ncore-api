const got = require('got');
const authenticator = require('./plugins/authenticator');
const userAgent = require('./plugins/user_agent');

module.exports = function makeClient({ url, username, password }) {
  const instance = got.extend(
    authenticator({
      username,
      password,
    }),
    userAgent('kalacska'),
    {
      prefixUrl: url,
      followRedirect: false,
    }
  );

  return {
    getTorrents: () => instance.get('torrents.php'),
  };
};
