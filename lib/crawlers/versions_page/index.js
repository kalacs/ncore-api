const R = require('ramda');
const findVersions = require('./parsers/find_versions');

module.exports = details => {
  const verionsFinder = findVersions(details);
  const groupByQuality = R.groupBy(R.view(R.lensProp('quality')));
  const groupByLanguage = R.compose(R.groupBy(R.view(R.lensProp('language'))));

  return {
    onopentag(name, attribs) {
      verionsFinder.onopentag(name, attribs);
    },
    getResults() {
      return {
        byQuality: groupByQuality(verionsFinder.getValues()),
        byLanguage: groupByLanguage(verionsFinder.getValues()),
      };
    },
  };
};
