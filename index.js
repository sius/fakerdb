
const { replay, jsft, insert, progress } = require('./streams');

module.exports = function(db, schema, options = null, cb = null ) {
  let _db = db;
  if (!db) {
    const Datasource = require('nedb');
    _db = new Datasource({ filename: 'faker.db', autoload: true })
  }
  let _opts = options || { replay: 1, insert: { blockSize: 1 } };
  let jsf = _opts.jsft;
  if (!jsf) {
    jsf = require('json-schema-faker')
    let { Chance } = require('chance')
      , faker = require('faker');
    jsf.extend('faker', () => faker);
    jsf.extend('chance', () => new Chance());
  }

  replay(schema, _opts)
    .pipe(jsft(jsf))
    .pipe(insert(_db, _opts))
    .pipe(progress(_opts, cb));
};
