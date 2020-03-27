module.exports = result => {
  let match = 0;
  let dateText = '';
  return {
    onopentag(name, attribs) {
      if (name === 'div' && attribs.class === 'box_feltoltve2') {
        match = 1;
      }
    },
    ontext(text) {
      if (match) {
        dateText += text;
      }
    },
    onclosetag(name) {
      if (name === 'div' && match) {
        match = 0;
        result.push(dateText);
        dateText = '';
      }
    },
  };
};
