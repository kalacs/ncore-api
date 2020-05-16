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
const UHD = ['UHD', '2160p'];
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

module.exports = {
  combiner: (fields, ...arrays) => {
    const [firstArray] = arrays;

    return firstArray.reduce((acc, _, row) => {
      const object = {};
      fields.forEach((value, index) => {
        object[value] = arrays[index][row];
      });
      acc.push(object);
      return acc;
    }, []);
  },
  getQuality,
};
