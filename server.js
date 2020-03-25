require('dotenv').config();

const fastify = require('fastify')({ logger: true });
const makeScraper = require('./lib/scraper');

// Declare a route
fastify.get('/movies', async (request, reply) => {
  try {
    const scraper = makeScraper({
      username: process.env.NCORE_NICK,
      password: process.env.NCORE_PASSHASH,
      type: 'ncore',
    });
    return scraper.getMovies();
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
