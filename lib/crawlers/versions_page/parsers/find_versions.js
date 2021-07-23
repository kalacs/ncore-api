/* eslint-disable prefer-object-spread */
/* eslint-disable no-plusplus */
const findSize = require('./find_size');
const { getDownloadKey, getQuality } = require('../../../helpers');

module.exports = ({
  id,
  title: parentTitle,
  language: parentLanguage,
  size,
  quality,
  downloadUrl,
}) => {
  const values = [
    {
      torrentId: id,
      title: parentTitle,
      size,
      quality,
      language: parentLanguage,
      downloadUrl,
    },
  ];
  const is3D = value => value.indexOf('.3D.') > -1 || value.indexOf(' 3D') > -1;
  const sizeFinder = findSize();
  let language;
  let title;
  let object;

  return {
    onopentag: (name, attribs) => {
      if (name === 'div' && attribs.class === 'box_torrent_mini2') {
        object = {
          torrentId: '',
          title: '',
          size: '',
          quality: '',
          language: '',
          downloadUrl: '',
        };
      }

      sizeFinder.onopentag(name, attribs);
      if (name === 'img' && attribs.class && attribs.class === 'categ_link') {
        [, language] = attribs.alt.split('/').map(value => value.toLowerCase());
      }

      if (
        name === 'a' &&
        /torrents.php\?action=details&id=/.test(attribs.href) &&
        attribs.title &&
        !is3D(attribs.title)
      ) {
        const [
          ,
          torrentId,
        ] = /torrents.php\?action=details&id=([0-9a-z]*)/.exec(
          attribs.href
        ) || [''];

        title = attribs.title;
        const key = getDownloadKey();
        object.title = title;
        object.quality = getQuality(title);
        object.language = language;
        object.torrentId = torrentId;
        object.downloadUrl = `https://ncore.cc/torrents.php?action=download&id=${torrentId}&key=${key}`;
        values.push(object);
      }
    },
    ontext: text => {
      sizeFinder.ontext(text);
      if (object) {
        object.size = sizeFinder.getValue();
      }
    },
    getValues() {
      return values;
    },
  };
};
