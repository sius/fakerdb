/**
 * transformation stream: write JSON schema instances into the provided db
 * DB support for:
 * - knex
 * - nedb
 * - mongodb
 * - required signature: db.insertMany(obj, cb: (err, result) => void)
 * @param db
 */
const { Nedb, Mongodb, Knex } = require('./db');
  

function _isNedb(db) {

  return ('inMemoryOnly' in db) 
    && ('autoload' in db)
    && ('filename');
}
module.exports = function (db, options) {

  let blockSize = 1;
  if (options && options.insert) {
    blockSize = options.insert.blockSize || 1;
  }

  if (db == null) {
    const Datasource = require('nedb');
    let file = options ? options.filename || 'faker.db' : 'faker.db';
    return new Nedb(new Datasource({ filename: file, autoload: true }), blockSize);
  } else if (_isNedb(db)) {
    return new Nedb(db, blockSize);
  } else if (db.client) {
    return new Knex(db, blockSize);
  } else {
    return new Mongodb(db, blockSize);
  }
}
