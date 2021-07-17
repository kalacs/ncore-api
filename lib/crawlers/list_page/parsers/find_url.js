module.exports = result => {
  return {
    onopentag(name, attribs) {
      if (name === 'div' && attribs.class === 'torrent_txt2') {
        result.push('');
      }

      if (name === 'a' && attribs.class === 'infolink') {
        const [, url] = attribs.href.split('?');
        result.push(url);
      }
    },
  };
};
