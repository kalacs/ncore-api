require('dotenv').config();

const fastify = require('fastify')({ logger: true });
const makeScraper = require('./lib/scraper');

const scraper = makeScraper({
  username: process.env.NCORE_NICK,
  password: process.env.NCORE_PASSHASH,
  type: 'ncore',
});
// Declare a route
fastify.get('/movies', async (request, reply) => {
  try {
    reply.send(await scraper.getMovies({ genres: [] }));
  } catch (error) {
    console.dir(error);
  }
});

fastify.get('/movies/:id', async (request, reply) => {
  try {
    return scraper.getMovie(request.params.id);
  } catch (error) {
    console.dir(error);
  }
});

fastify.get('/torrent/:id', async (request, reply) => {
  try {
    return scraper.getTorrentFile(request.params.id);
  } catch (error) {
    console.dir(error);
  }
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
