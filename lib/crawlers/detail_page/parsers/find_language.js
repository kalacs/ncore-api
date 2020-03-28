module.exports = () => {
  const pattern = /torrents\.php\?tipus=(.*)/;
  let value;
  return {
    onopentag(name, attribs) {
      if (name === 'a' && pattern.test(attribs.href)) {
        const [, match] = pattern.exec(attribs.href) || [''];
        [, value] = match
          .split('_')
          .map(value => value.toLowerCase())
          .map(([first, second, ...rest]) => [first, second].join(''));
      }
    },
    getValue() {
      return value;
    },
  };
};
