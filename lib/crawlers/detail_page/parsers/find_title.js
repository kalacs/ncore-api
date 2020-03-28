module.exports = () => {
  let match = 0;
  let value;

  return {
    onopentag(name, attribs) {
      if (
        name === 'div' &&
        attribs.class &&
        attribs.class === 'torrent_reszletek_cim'
      ) {
        match = 1;
      }
    },
    ontext(text) {
      if (match) {
        value = text;
        match = 0;
      }
    },
    getValue() {
      return value;
    },
  };
};
