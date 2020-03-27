const findTitle = require('./parsers/find_title');
const findIMDBId = require('./parsers/find_id');
const findIMDBUrl = require('./parsers/find_url');
const findUploadTime = require('./parsers/find_upload_datetime');
const findTorrentId = require('./parsers/find_torrent_id');

module.exports = () => {
  const titles = [];
  const ids = [];
  const urls = [];
  const times = [];
  const torrentIds = [];
  const titleFinder = findTitle(titles);
  const imdbIdFinder = findIMDBId(ids);
  const imdbUrlFinder = findIMDBUrl(urls);
  const uploadTimeFinder = findUploadTime(times);
  const torrentIdFinder = findTorrentId(torrentIds);

  return {
    onopentag(name, attribs) {
      titleFinder.onopentag(name, attribs);
      imdbIdFinder.onopentag(name, attribs);
      imdbUrlFinder.onopentag(name, attribs);
      uploadTimeFinder.onopentag(name, attribs);
      torrentIdFinder.onopentag(name, attribs);
    },
    ontext(text) {
      titleFinder.ontext(text);
      uploadTimeFinder.ontext(text);
    },
    onclosetag(name) {
      uploadTimeFinder.onclosetag(name);
    },
    getResults() {
      return {
        titles,
        ids,
        urls,
        times,
        torrentIds,
      };
    },
  };
};
