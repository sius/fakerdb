const { Transform } = require('stream');

/**
 * @param opts
 * {
 *  insertBlockSize: number,
 *  db: string,
 * }
 */


class DbTransform extends Transform {

  constructor(db, insertBlockSize = 1)  {
    super({
      readableObjectMode: true,
      writableObjectMode: true
    });
    this._db = db;
    this._chunks = [];
    this._insertBlockSize = insertBlockSize || 1;
  }

  get db() {
    return this._db
  }

  get chunks() {
    return this._chunks;
  }

  set chunks(value) {
    this._chunks = value;
  }

  insert(callback) {
    callback();
  }
  
  _flush(callback) {
    if (this._chunks.length > 0) {
      this.insert(callback);
    } else {
      callback()
    }
  }

  _transform(chunk, encoding, callback) {
    
    this.chunks.push(JSON.parse(chunk));
    if (this.chunks.length == this._insertBlockSize) {
      this.insert(callback);
    } else {
      callback();
    }
  }
  
  _isIterable(obj) {
    if (obj == null) {
      return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
  }
}

module.exports.DbTransform = DbTransform;
