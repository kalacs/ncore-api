const got = require('got');
const authenticator = require('./plugins/authenticator');
const userAgent = require('./plugins/user_agent');
const cookieHandler = require('./plugins/cookie');

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
        ? instance.stream.post.bind(instance.stream)
        : instance.stream.get.bind(instance.stream);
      return request('torrents.php', { searchParams, body });
    },
  };
};
