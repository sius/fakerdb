#!/usr/bin/env node

let { Chance } = require('chance')
  , faker = require('faker')
  , jsf = require('json-schema-faker')
  , { replay, jsft, insert, progress } = require('./streams')
  , { args } = require('args');

args
  .option('blockSize', 'The insert blockSize', 1)
  .option('replay', 'The total number of schema instances to generate', 1)
  .option('schema', 'The path to the JSON schema file')
  .option('jsf', 'The path to the JSON schema faker javascript file')
  .option('file', 'The filename where to write the generated JSON records', 'faker.db')
  .option('client', '')
  .option('connection', '')
  .command('generate', 'Start the test data generation stream', ['g'])

const flags = args.parse(process.argv)

jsf.extend('faker', () => faker);
jsf.extend('chance', () => new Chance());

module.exports = function(db, schema, options = null, cb = null ) {
  let _db = db;
  let _opts = options || { replay: 1, insert: { blockSize: 100 } };
  if (!db) {
    const Datasource = require('nedb');
    _db = new Datasource({ filename: 'faker.db', autoload: true })
  }
  
  replay(schema, _opts)
    .pipe(jsft(jsf))
    .pipe(insert(_db, _opts))
    .pipe(progress(_opts, cb));
};
