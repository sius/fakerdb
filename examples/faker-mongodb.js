
let { generate } = require('../')
  , { MongoClient } = require('mongodb')
  , path = require('path');

const REPLAY = 1000;
const SCHEMA = path.join(__dirname, './schema/person.json');
const OPTS = { replay: REPLAY, insert: { blockSize: 1000 } };

MongoClient.connect('mongodb://localhost:27017/fakerdb', { useNewUrlParser: true }, (err, client) => {
  if (err) {
    return console.log(err)
  }
  generate(client.db().collection("people"), SCHEMA, OPTS);
})
