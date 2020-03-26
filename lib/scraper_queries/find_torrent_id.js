module.exports = result => {
  return {
    onopentag(name, attribs) {
      if (
        name === 'div' &&
        attribs.class &&
        attribs.class.indexOf('torrent_lenyilo') > -1
      ) {
        result.push(attribs.id);
      }
    },
  };
};
