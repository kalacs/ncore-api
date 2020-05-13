const findVersions = require('./parsers/find_versions');

module.exports = details => {
  const verionsFinder = findVersions(details);

  return {
    onopentag(name, attribs) {
      verionsFinder.onopentag(name, attribs);
    },
    ontext(text) {
      verionsFinder.ontext(text);
    },
    getResults() {
      return {
        versions: verionsFinder.getValues(),
      };
    },
  };
};
