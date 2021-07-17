/* eslint-disable no-useless-catch */
const got = require('got');

module.exports = ({ username, passhash }) => {
  return got.extend({
    hooks: {
      beforeRequest: [
        options => {
          const { url } = options;
          const path = `${url.protocol}//${url.hostname}`;
          options.cookieJar.setCookie(`nick=${username}`, path);
          options.cookieJar.setCookie(`pass=${passhash}`, path);
          options.cookieJar.setCookie(`stilus=mist`, path);
          options.cookieJar.setCookie(`nyelv=hu`, path);
        },
      ],
    },
  });
};
