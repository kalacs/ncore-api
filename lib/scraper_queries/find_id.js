module.exports = result => {
  return {
    onopentag(name, attribs) {
      if (name === 'a' && attribs.class === 'infolink') {
        result.push(attribs.href);
      }
    },
  };
};
