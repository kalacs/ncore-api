module.exports = () => {
  const value = [];

  return {
    onopentag(name, attribs) {
      if (
        name === 'a' &&
        /torrents.php\?action=details&id=/.test(attribs.href) &&
        attribs.title
      ) {
        value.push(attribs.title);
      }
    },
    getValue() {
      return value;
    },
  };
};
