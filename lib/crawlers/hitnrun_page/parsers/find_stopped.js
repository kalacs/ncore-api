module.exports = () => {
  let match = 0;
  const value = [];

  return {
    onopentag(name, attribs) {
      if (name === 'span' && attribs.class && attribs.class === 'stopped') {
        match = 1;
      }
    },
    ontext(text) {
      if (match) {
        match = 0;

        value.push(text);
      }
    },
    getValue() {
      return value;
    },
  };
};
