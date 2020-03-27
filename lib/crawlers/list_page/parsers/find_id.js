module.exports = result => {
  return {
    onopentag(name, attribs) {
      if (name === 'a' && attribs.class === 'infolink') {
        const [, id] = /\/([0-9a-z]+)\/$/.exec(attribs.href) || [''];
        result.push(id);
      }
    },
  };
};
