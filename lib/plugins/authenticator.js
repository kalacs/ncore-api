/* eslint-disable no-useless-catch */
const got = require('got');

function isRedirectToIndex({ headers, statusCode }) {
  return statusCode === 302 && /login.php/.test(headers.location);
}

module.exports = ({ username, password }) => {
  return got.extend({
    handlers: [
      (options, next) => {
        // Don't touch streams
        if (options.isStream) {
          return next(options);
        }

        // Magic begins
        return (async () => {
          try {
            const response = await next(options);
            if (isRedirectToIndex(response)) {
              console.log('REDIRECT');
              console.log(options);
              console.log(response.headers);
            }

            return response;
          } catch (error) {
            throw error;
          }
        })();
      },
    ],
  });
};
