const findVersions = require('./parsers/find_versions');

module.exports = () => {
  const verionsFinder = findVersions();

  return {
    onopentag(name, attribs) {
      verionsFinder.onopentag(name, attribs);
    },
    getResults() {
      return {
        versions: verionsFinder.getValues(),
      };
    },
  };
};
