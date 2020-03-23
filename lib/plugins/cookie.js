const got = require('got');
const { CookieJar } = require('tough-cookie');

const cookieJar = new CookieJar();
const compatCookieJar = {
  setCookie: (rawCookie, url) =>
    new Promise((resolve, reject) =>
      cookieJar.setCookie(rawCookie, url, (err, value) =>
        err ? reject(err) : resolve(value)
      )
    ),
  getCookieString: async url =>
    new Promise((resolve, reject) =>
      cookieJar.getCookieString(url, (err, value) =>
        err ? reject(err) : resolve(value)
      )
    ),
};
module.exports = got.extend({
  cookieJar: compatCookieJar,
});
