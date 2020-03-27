module.exports = () => {
  let id;
  return {
    onopentag(name, attribs) {
      if (name === 'a' && /title\/([0-9a-z]*)/.test(attribs.href)) {
        [, id] = /title\/([0-9a-z]*)/.exec(attribs.href) || [''];
      }
    },
    getValue() {
      return id;
    },
  };
};
