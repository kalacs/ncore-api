module.exports = result => {
  return {
    onopentag(name, attribs) {
      if (name === 'a' && attribs.class === 'infolink') {
        const [, url] = attribs.href.split('?');
        result.push(url);
      }
    },
  };
};
