module.exports = () => {
  const pattern = /torrents\.php\?tipus=(.*)/;
  let elementFound = false;
  let value;
  return {
    onopentag(name, attribs) {
      if (name === 'a' && pattern.test(attribs.href)) {
        const [, match] = pattern.exec(attribs.href) || [''];
        if (match) {
          elementFound = true;
        }
      }
    },
    ontext(text) {
      if (elementFound) {
        [, value] = text
          .split('/')
          .map(languageString => languageString.toLowerCase());
        elementFound = false;
      }
    },
    getValue() {
      return value;
    },
  };
};
