const findTitle = require('./parsers/find_title');
const findIMDBId = require('./parsers/find_id');
const findIMDBUrl = require('./parsers/find_url');
const findUploadTime = require('./parsers/find_upload_datetime');
const findTorrentId = require('./parsers/find_torrent_id');
const findSize = require('./parsers/find_size');
const findLanguage = require('./parsers/find_language');
const { getQuality } = require('../../helpers');

module.exports = () => {
  const titles = [];
  const ids = [];
  const urls = [];
  const times = [];
  const torrentIds = [];
  const sizes = [];
  const languages = [];
  const titleFinder = findTitle(titles);
  const imdbIdFinder = findIMDBId(ids);
  const imdbUrlFinder = findIMDBUrl(urls);
  const uploadTimeFinder = findUploadTime(times);
  const torrentIdFinder = findTorrentId(torrentIds);
  const sizeFinder = findSize(sizes);
  const languageFinder = findLanguage(languages);

  return {
    onopentag(name, attribs) {
      titleFinder.onopentag(name, attribs);
      imdbIdFinder.onopentag(name, attribs);
      imdbUrlFinder.onopentag(name, attribs);
      uploadTimeFinder.onopentag(name, attribs);
      torrentIdFinder.onopentag(name, attribs);
      sizeFinder.onopentag(name, attribs);
      languageFinder.onopentag(name, attribs);
    },
    ontext(text) {
      uploadTimeFinder.ontext(text);
      sizeFinder.ontext(text);
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
        sizes,
        languages,
        qualities: titles.map(getQuality),
      };
    },
  };
};
