"use strict";
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

  if (!db) {
    const Datasource = require('nedb');
    let file = options ? options.filename || 'faker.db' : 'faker.db',
    db = new Datasource({ filename: file, autoload: true })
  }

  let blockSize = 1;
  if (options && options.insert) {
    blockSize = options.insert.blockSize || 1;
  }

  if (_isNedb(db)) {
    return new Nedb(db, blockSize);
  } else if (db.client) {
    return new Knex(db, blockSize);
  } else {
    return new Mongodb(db, blockSize);
  }
}
