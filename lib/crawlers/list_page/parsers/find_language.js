module.exports = result => {
  return {
    onopentag(name, attribs) {
      if (name === 'img' && attribs.class && attribs.class === 'categ_link') {
        const [, language] = attribs.alt
          .split('/')
          .map(value => value.toLowerCase());
        result.push(language);
      }
    },
  };
};
