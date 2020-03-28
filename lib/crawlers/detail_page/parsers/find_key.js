module.exports = () => {
  const pattern = /&key=([0-9a-z]*)/;
  let value;

  return {
    onopentag(name, attribs) {
      if (name === 'a' && pattern.test(attribs.href)) {
        [, value] = pattern.exec(attribs.href) || [''];
      }
    },
    getValue() {
      return value;
    },
  };
};
