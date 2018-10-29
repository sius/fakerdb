let { Chance } = require('chance')
  , faker = require('faker')
  , jsf = require('json-schema-faker')
  , { replay, jsft, insert, progress } = require('./streams');

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
