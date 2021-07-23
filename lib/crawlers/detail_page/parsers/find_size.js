module.exports = () => {
  const pattern = /\((\d+)\sbájt\)/;
  let elementFound = false;
  let value;
  return {
    onopentag(name, attribs) {
      if (name === 'div' && attribs.class && attribs.class === 'dd') {
        elementFound = true;
      }
    },
    ontext(text) {
      if (elementFound) {
        const [, match] = pattern.exec(text) || [];

        if (match) {
          value = parseInt(match, 0);
        }

        elementFound = false;
      }
    },
    getValue() {
      return value;
    },
  };
};
