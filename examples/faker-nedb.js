
var { replay, jsft, insert, progress } = require('../streams')
, Datasource = require('nedb')
, db = new Datasource({ filename: 'faker.db', autoload: true })
, faker = require('faker')
, jsf = require('json-schema-faker')
, path = require('path');

jsf.extend('faker', () => faker);

const REPLAY = 1000;
const SCHEMA  = path.join(__dirname, './schema/person.json');
const OPTS = { replay: REPLAY, insert: { blockSize: 1000 } };

replay(SCHEMA, OPTS)
  .pipe(jsft(jsf))
  .pipe(insert(db, OPTS))
  .pipe(progress(OPTS));
