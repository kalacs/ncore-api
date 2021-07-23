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

### `getMovies`

The result contains the first 25 item from movie section according to the given filters.

#### Parameter

It accepts only one parameter which is a filter object.

| Property        | Default    | Description                                                                                                                                                                                                                                                                     |
| --------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `genres`        | `[]`       | List of genres. Possible values: `animáció, vígjáték, misztikus, ismeretterjesztő, dráma, thriller, háborús, valóságshow, életrajz, családi, western, akció, bűnügyi, horror, fantasy, romantikus, rövidfilm, történelmi, dokumentumfilm, musical, sport, kaland, sci-fi, zene` |
| `sortBy`        | `uploaded` | Sorting criteria. Possible values: `title,uploaded,size,downloaded_times,seeders,leechers`                                                                                                                                                                                      |
| `sortDirection` | `DESC`     | The direction of the sorting. `DESC` or`ASC`                                                                                                                                                                                                                                    |

#### Return value

It returns an array with objects. This is how a movie object looks like:

| Property        | Type     | Description                                                 |
| --------------- | -------- | ----------------------------------------------------------- |
| `id`            | `string` | The id of the torrent                                       |
| `imdbId`        | `string` | The IMDB id of the movie                                    |
| `imdbUrl`       | `string` | The IMDB url of the movie                                   |
| `title`         | `string` | The title of the torrent                                    |
| `last_modified` | `string` | The datetime when the torrent was modified at the last time |

### `getMovie`

This returns the details of the given movie (with languages and resolutions)

#### Parameter

It accepts only one parameter which is a torrent id.

| Parameter | Type     | Description           |
| --------- | -------- | --------------------- |
| `id`      | `string` | The id of the torrent |

#### Return value

It returns an objects with this schema:

| Property      | Type     | Description                                                |
| ------------- | -------- | ---------------------------------------------------------- |
| `id`          | `string` | The id of the torrent                                      |
| `imdbId`      | `string` | The IMDB id of the movie                                   |
| `imdbUrl`     | `string` | The IMDB url of the movie                                  |
| `title`       | `string` | The title of the torrent                                   |
| `language`    | `string` | The language of the audio                                  |
| `size`        | `number` | The downloaded size of the movie                           |
| `quality`     | `string` | The resolution of the given version                        |
| `downloadUrl` | `string` | The url where the torrent file of the movie could download |
| `versions`    | `array`  | The other versions of the movie                            |

Versions contains objects that look like this:

| Property      | Type     | Description                                                |
| ------------- | -------- | ---------------------------------------------------------- |
| `torrentId`   | `string` | The id of the torrent                                      |
| `title`       | `string` | The title of the torrent                                   |
| `size`        | `number` | The downloaded size of the movie                           |
| `quality`     | `string` | The resolution of the given version                        |
| `language`    | `string` | The language of the audio                                  |
| `downloadUrl` | `string` | The url where the torrent file of the movie could download |

### `getMovieByImdb`

This returns the details of the movie that was searched by IMDB id.

#### Parameter

It accepts only one parameter which is a IMDB id.

| Parameter | Type     | Description                    |
| --------- | -------- | ------------------------------ |
| `imdbId`  | `string` | The IMDB id of the given movie |

#### Return value

It returns an objects with this schema:

| Property        | Type     | Description                                                 |
| --------------- | -------- | ----------------------------------------------------------- |
| `id`            | `string` | The id of the torrent                                       |
| `imdbId`        | `string` | The IMDB id of the movie                                    |
| `imdbUrl`       | `string` | The IMDB url of the movie                                   |
| `title`         | `string` | The title of the torrent                                    |
| `last_modified` | `string` | The datetime when the torrent was modified at the last time |
| `size`          | `number` | The downloaded size of the movie                            |
| `language`      | `string` | The language of the audio                                   |
| `quality`       | `string` | The resolution of the given version                         |
| `versions`      | `array`  | The other versions of the movie                             |

Versions contains objects that look like this:

| Property        | Type     | Description                                                 |
| --------------- | -------- | ----------------------------------------------------------- |
| `id`            | `string` | The id of the torrent                                       |
| `imdbId`        | `string` | The IMDB id of the movie                                    |
| `imdbUrl`       | `string` | The IMDB url of the movie                                   |
| `title`         | `string` | The title of the torrent                                    |
| `last_modified` | `string` | The datetime when the torrent was modified at the last time |
| `size`          | `number` | The downloaded size of the movie                            |
| `language`      | `string` | The language of the audio                                   |
| `quality`       | `string` | The resolution of the given version                         |

### `getTorrentFile`

It returns a node.js stream that contains a torrent file.

#### Parameter

It accepts only one parameter which is a torrent id.

| Parameter | Type     | Description           |
| --------- | -------- | --------------------- |
| `id`      | `string` | The id of the torrent |

#### Return value

Example:

```js
const createNcoreApi = require('ncore-api');
const { createWriteStream } = require('fs');

(async () => {
  try {
    const ncoreApi = await createNcoreApi({
      username: '*******',
      password: '*******',
      url: 'https://ncore.pro',
    });
    const result = await ncoreApi.getTorrentFile('2949391');
    result.pipe(createWriteStream('torrent.file'));
  } catch (error) {
    console.log(error);
  }
})();
```

### Missing features

- pagination
- tv shows related endpoints
