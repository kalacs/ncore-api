module.exports = () => {
  let value;

  return {
    onopentag(name, attribs) {
      if (name === 'a' && /notification&id=([0-9a-z]*)/.test(attribs.href)) {
        [, value] = /notification&id=([0-9a-z]*)/.exec(attribs.href) || [''];
      }
    },
    getValue() {
      return value;
    },
  };
};
