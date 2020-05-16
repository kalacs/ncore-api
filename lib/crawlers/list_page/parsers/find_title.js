module.exports = result => {
  return {
    onopentag(name, attribs) {
      if (
        name === 'a' &&
        /torrents.php\?action=details&id=/.test(attribs.href) &&
        attribs.title
      ) {
        result.push(attribs.title);
      }
    },
  };
};
