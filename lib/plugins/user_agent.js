const got = require('got');

module.exports = userAgent =>
  got.extend({ headers: { 'user-agent': userAgent } });
