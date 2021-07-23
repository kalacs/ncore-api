const FormData = require('form-data');
const got = require('got');
const authenticator = require('../plugins/authenticator');
const userAgent = require('../plugins/user_agent');
const cookieHandler = require('../plugins/cookie');

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
const DOWNLOAD_KEY = 'cc2b49f6937425b2b87003405cc46009';

function getQuality(value) {
  let result = SD_QUALITY;

  QUALITY_TAGS.forEach((tags, quality) => {
    tags.forEach(tag => {
      if (value.indexOf(tag) > -1) result = quality;
    });
  });
  return result;
}
const mapSortName = param => {
  return {
    title: 'name',
    uploaded: 'fid',
    size: 'size',
    downloaded_times: 'times_completed',
    seeders: 'seeders',
    leechers: 'leechers',
  }[param];
};

const createSortParam = ({ sortBy = 'uploaded' }) => [
  `miszerint`,
  mapSortName(sortBy),
];
const createSortDirectionParam = ({ sortDirection = 'DESC' }) => [
  `hogyan`,
  sortDirection,
];
const login = (username, password, url) => {
  const form = new FormData();
  form.append('set_lang', 'hu');
  form.append('submitted', '1');
  form.append('nev', username);
  form.append('pass', password);
  form.append('ne_leptessen_ki', '1');
  return new Promise((resolve, reject) => {
    form.submit(`${url}/login.php`, function(err, res) {
      if (err) reject(err);
      // eslint-disable-next-line prettier/prettier
      const passCookie = res.headers['set-cookie'].find(
        cookieString => cookieString.indexOf('pass=') > -1
      );
      const passhash = (function getPasshashFromCookie(cookieString) {
        const regex = /pass=(\w+);/;
        const [, captured] = regex.exec(cookieString);
        return captured;
      })(passCookie);
      resolve(passhash);
    });
  });
};
const createHttpClient = async ({ url, username, password }) => {
  let passhash;
  try {
    passhash = await login(username, password, url);
  } catch (error) {
    console.log(error);
  }
  const instance = got.extend(
    cookieHandler,
    authenticator({
      username,
      passhash,
    }),
    userAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36'
    ),
    {
      prefixUrl: url,
      followRedirect: false,
    }
  );
  return {
    get: instance.stream.get.bind(instance.stream),
    post: instance.stream.post.bind(instance),
  };
};
const getDownloadKey = () => DOWNLOAD_KEY;
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
  createSortParam,
  createSortDirectionParam,
  createHttpClient,
  getDownloadKey,
};
