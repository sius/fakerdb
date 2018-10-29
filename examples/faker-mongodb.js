
var { replay, jsft, insert, progress } = require('../streams')
, { MongoClient } = require('mongodb')
, faker = require('faker')
, jsf = require('json-schema-faker')
, path = require('path');

jsf.extend('faker', () => faker);

const REPLAY = 1000;
const SCHEMA = path.join(__dirname, './schema/person.json');
const OPTS = { replay: REPLAY, insert: { blockSize: 1000 } };

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, client) => {
  if (err) {
    return console.log(err)
  }
  const db = client.db('fakerdb');
  replay(SCHEMA, OPTS)
    .pipe(jsft(jsf))
    .pipe(insert(db.collection("people"), OPTS))
    .pipe(progress(OPTS, () => client.close()))
})
