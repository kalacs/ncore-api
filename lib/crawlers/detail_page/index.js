const findIMDBId = require('./parsers/find_id');
const findTorrentId = require('./parsers/find_torrent_id');

module.exports = () => {
  const imdbIdFinder = findIMDBId();
  const torrentIdFinder = findTorrentId();

  return {
    onopentag(name, attribs) {
      imdbIdFinder.onopentag(name, attribs);
      torrentIdFinder.onopentag(name, attribs);
    },
    ontext(text) {},
    onclosetag(name) {},
    getResults() {
      return {
        id: imdbIdFinder.getValue(),
        torrentId: torrentIdFinder.getValue(),
      };
    },
  };
};
