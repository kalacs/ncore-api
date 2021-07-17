module.exports = result => {
  return {
    onopentag(name, attribs) {
      if (name === 'div' && attribs.class === 'torrent_txt2') {
        result.push('');
      }

      if (name === 'a' && attribs.class === 'infolink') {
        const [, id] = /\/([0-9a-z]+)\/$/.exec(attribs.href) || [''];
        result.push(id);
      }
    },
  };
};
