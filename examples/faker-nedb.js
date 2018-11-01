
let { generate }  = require('../')
  , Datasource = require('nedb')
  , db = new Datasource({ filename: 'faker.db', autoload: true })
  , path = require('path');

const REPLAY = 1000;
const SCHEMA  = path.join(__dirname, './schema/person.json');
const OPTS = { replay: REPLAY, insert: { blockSize: 1000 } };

generate(db, SCHEMA, OPTS);
