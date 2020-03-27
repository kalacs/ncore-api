module.exports = result => {
  const matchPath = 'div.a.nobr';
  let path = [];
  return {
    onopentag(name, attribs) {
      if (
        (path.length === 0 &&
          name === 'div' &&
          attribs.class === 'torrent_txt') ||
        path.length > 0
      ) {
        path.push(name);
      }
    },
    ontext(text) {
      if (path.join('.') === matchPath) {
        result.push(text);
        path = [];
      }
    },
  };
};
