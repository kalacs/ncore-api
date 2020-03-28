/* eslint-disable prefer-object-spread */
/* eslint-disable no-plusplus */
const SD_QUALITY = 'sd';
const HD_QUALITY = 'hd';
const FHD_QUALITY = 'fhd';
const UHD_QUALITY = 'uhd';
const SD = [
  'DVDR',
  'DVD9',
  'DVD5',
  'DVD7',
  'DVD-5',
  'DVD-7',
  'DVD-9',
  'BDRip',
  'WEBRip',
  'DVDRip',
];
const HD = ['720p'];
const FHD = ['1080p', 'BD50', 'BD25'];
const UHD = ['UHD'];
const QUALITY_TAGS = new Map([
  [SD_QUALITY, SD],
  [HD_QUALITY, HD],
  [FHD_QUALITY, FHD],
  [UHD_QUALITY, UHD],
]);

function getQuality(value) {
  let result = SD_QUALITY;

  QUALITY_TAGS.forEach((tags, quality) => {
    tags.forEach(tag => {
      if (value.indexOf(tag) > -1) result = quality;
    });
  });

  return result;
}

module.exports = details => {
  const values = [
    Object.assign({}, details, { quality: getQuality(details.title) }),
  ];
  const is3D = value => value.indexOf('.3D.') > -1 || value.indexOf(' 3D') > -1;
  let language;

  return {
    onopentag(name, attribs) {
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

        const { title } = attribs;
        const { key } = details;
        values.push({
          title,
          quality: getQuality(title),
          language,
          key,
          torrentId,
          downloadUrl: `https://ncore.cc/torrents.php?action=download&id=${torrentId}&key=${key}`,
        });
      }
    },
    getValues() {
      return values;
    },
  };
};
