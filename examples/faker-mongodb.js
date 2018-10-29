
let fakerdb = require('../')
, { MongoClient } = require('mongodb')
, path = require('path');

const REPLAY = 1000;
const SCHEMA = path.join(__dirname, './schema/person.json');
const OPTS = { replay: REPLAY, insert: { blockSize: 1000 } };

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, client) => {
  if (err) {
    return console.log(err)
  }
  const db = client.db('fakerdb');
  fakerdb(db.collection("people"), SCHEMA, OPTS);
})
