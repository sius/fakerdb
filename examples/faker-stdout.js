
var { replay, jsft } = require('../streams')
, faker = require('faker')
, jsf = require('json-schema-faker')
, path = require('path');

jsf.extend('faker', () => faker);

const SCHEMA_OBJ = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      faker: 'name.findName'
    }
  },
  required: [
    'name'
  ]
};

replay(SCHEMA_OBJ, { replay: 2 })
  .pipe(jsft(jsf))
  .pipe(process.stdout);

const SCHEMA_FILE = path.join(__dirname, './schema/person.json');
replay(SCHEMA_FILE, { replay: 2 })
    .pipe(jsft(jsf))
    .pipe(process.stdout);
