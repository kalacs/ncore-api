const findIMDBId = require('./parsers/find_id');
const findTorrentId = require('./parsers/find_torrent_id');
const findKey = require('./parsers/find_key');
const findLanguage = require('./parsers/find_language');
const findTitle = require('./parsers/find_title');
const findSize = require('./parsers/find_size');
const { getQuality } = require('../../helpers');

module.exports = () => {
  const imdbIdFinder = findIMDBId();
  const torrentIdFinder = findTorrentId();
  const keyFinder = findKey();
  const languageFinder = findLanguage();
  const titleFinder = findTitle();
  const sizeFinder = findSize();

  return {
    onopentag(name, attribs) {
      imdbIdFinder.onopentag(name, attribs);
      torrentIdFinder.onopentag(name, attribs);
      keyFinder.onopentag(name, attribs);
      languageFinder.onopentag(name, attribs);
      titleFinder.onopentag(name, attribs);
      sizeFinder.onopentag(name, attribs);
    },
    ontext(text) {
      titleFinder.ontext(text);
      languageFinder.ontext(text);
      sizeFinder.ontext(text);
    },
    getResults() {
      const id = torrentIdFinder.getValue();
      const key = keyFinder.getValue();
      const imdbId = imdbIdFinder.getValue();

      return {
        id,
        imdbId,
        imdbUrl: `https://imdb.com/title/${imdbId}/`,
        title: titleFinder.getValue(),
        language: languageFinder.getValue(),
        size: sizeFinder.getValue(),
        quality: getQuality(titleFinder.getValue()),
        downloadUrl: `https://ncore.pro/torrents.php?action=download&id=${id}&key=${key}`,
      };
    },
  };
};
