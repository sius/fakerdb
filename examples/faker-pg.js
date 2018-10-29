var { replay, jsft, insert, progress } = require('../streams')
  , config = {
    client: 'pg',
    connection: 'postgresql://faker:faker@localhost:5432/fakerdb'
  }
  , knex = require('knex')(config)
  , person = knex('person')
  , faker = require('faker')
  , jsf = require('json-schema-faker')
  , path = require('path');

jsf.extend('faker', () => faker);

const REPLAY = 1000;
const SCHEMA  = path.join(__dirname, './schema/person.json');
const OPTS = { replay: REPLAY, insert: { blockSize: 1000 } };

knex.migrate.latest({ directory: './knex/migrations' })
  .then(
    () => {
      replay(SCHEMA, OPTS)
        .pipe(jsft(jsf))
        .pipe(insert(person, OPTS))
        .pipe(progress(OPTS));
    }
  );
