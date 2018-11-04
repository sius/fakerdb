let { generate } = require('../')
  , config = {
    client: 'pg',
    connection: 'postgresql://faker:faker@localhost:5432/fakerdb'
  }
  , knex = require('knex')(config)
  , path = require('path');

const REPLAY = 1000;
const SCHEMA  = path.join(__dirname, './schema/person.json');
const OPTS = { replay: REPLAY, insert: { blockSize: 1000 } };

knex.migrate.latest({ directory: './knex/migrations' })
  .then( () => generate(knex('person'), SCHEMA, OPTS) );
