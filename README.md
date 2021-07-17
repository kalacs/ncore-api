# ncore-api

## What

It provides REST API for ncore torrent provider.

## Why

As the time of the writing, ncore has no REST API at all. With the help of this package, a lot of new possibilities could be risen in terms of ncore related applications: torrent notifier, native applications ... etc.

## How it works

It transforms html content to JSON output.

## How it should be used

```javascript
const createNcoreApi = require('ncore-api');

(async () => {
  try {
    const ncoreApi = await createNcoreApi({
      username: '', // needs to be filled
      password: '', // needs to be filled
    });
    const result = await ncoreApi.getMovies();
    console.log(result);
  } catch (error) {
    console.log(error);
  }
})();
```

## API

- `.getMovies()` will return the top 25 movies
- `.getMovie(id)` will return the details of the given movie (with languages and resolutions)
- `.getMovieByImdb(imdbId)`
- `.getTorrentFile()`
