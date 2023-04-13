const findTitle = require('./parsers/find_title');
const findStart = require('./parsers/find_start');
const findLastactive = require('./parsers/find_lastactive');
const findStopped = require('./parsers/find_stopped');
const findUp = require('./parsers/find_up');
const findDown = require('./parsers/find_down');

module.exports = () => {
  const titleFinder = findTitle();
  const startFinder = findStart();
  const lastactiveFinder = findLastactive();
  const stoppedFinder = findStopped();
  const upFinder = findUp();
  const downFinder = findDown();

  return {
    onopentag(name, attribs) {
      titleFinder.onopentag(name, attribs);
      startFinder.onopentag(name, attribs);
      lastactiveFinder.onopentag(name, attribs);
      stoppedFinder.onopentag(name, attribs);
      upFinder.onopentag(name, attribs);
      downFinder.onopentag(name, attribs);
    },
    ontext(text) {
      startFinder.ontext(text);
      lastactiveFinder.ontext(text);
      stoppedFinder.ontext(text);
      upFinder.ontext(text);
      downFinder.ontext(text);
    },
    getResults() {
      const title = titleFinder.getValue();
      const start = startFinder.getValue();
      const lastactive = lastactiveFinder.getValue();
      const up = upFinder.getValue();
      const down = downFinder.getValue();

      const stopped = stoppedFinder.getValue().reduce(
        (coll, stop, i) => {
          switch (i % 3) {
            case 0:
              coll.status.push(stop);
              break;
            case 1:
              coll.remaining.push(stop);
              break;
            case 2:
              coll.ratio.push(stop);
              break;
            default:
              break;
          }

          return coll;
        },
        {
          status: [],
          remaining: [],
          ratio: [],
        }
      );

      return {
        title,
        start,
        lastactive,
        up,
        down,
        ...stopped,
      };
    },
  };
};
