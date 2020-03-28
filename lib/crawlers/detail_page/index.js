const findIMDBId = require('./parsers/find_id');
const findTorrentId = require('./parsers/find_torrent_id');
const findKey = require('./parsers/find_key');
const findLanguage = require('./parsers/find_language');

module.exports = () => {
  const imdbIdFinder = findIMDBId();
  const torrentIdFinder = findTorrentId();
  const keyFinder = findKey();
  const languageFinder = findLanguage();

  return {
    onopentag(name, attribs) {
      imdbIdFinder.onopentag(name, attribs);
      torrentIdFinder.onopentag(name, attribs);
      keyFinder.onopentag(name, attribs);
      languageFinder.onopentag(name, attribs);
    },
    getResults() {
      const id = torrentIdFinder.getValue();
      const key = keyFinder.getValue();
      return {
        id: imdbIdFinder.getValue().replace('tt', ''),
        imdbId: imdbIdFinder.getValue(),
        torrentId: torrentIdFinder.getValue(),
        language: languageFinder.getValue(),
        key,
        downloadUrl: `https://ncore.cc/torrents.php?action=download&id=${id}&key=${key}`,
      };
    },
  };
};
