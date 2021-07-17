const KILO_BYTE = 1080;
const MEGA_BYTE = KILO_BYTE * KILO_BYTE;
const GIGA_BYTE = MEGA_BYTE * KILO_BYTE;

module.exports = () => {
  let match = 0;
  let value;

  return {
    onopentag(name, attribs) {
      if (name === 'div' && attribs.class === 'box_meret2') {
        match = 1;
      }
    },
    ontext(text) {
      if (match) {
        const [sizePortion, measurePortion] = text.split(' ');
        value = sizePortion;
        if (measurePortion === 'MiB') value = sizePortion * MEGA_BYTE;
        if (measurePortion === 'GiB') value = sizePortion * GIGA_BYTE;
        match = 0;
      }
    },
    getValue() {
      return value;
    },
  };
};
