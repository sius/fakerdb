const { DbTransform } = require('./dbTransform');

class Mongodb extends DbTransform {
  
  insert(callback) {
    if (this.chunks.length == 0) {
      callback();
      return;
    }

    this.db.insertMany(this.chunks, (err, data) => {
      if (err) {
        callback(err);
      } else {
        if (!this._isIterable(data.ops)) {
          callback('db not suppported!')
          return;
        }
        for (let item of data.ops) {
          this.push(item);
        }
        this.chunks = []
        callback();
      }
    });
  }
}

module.exports.Mongodb = Mongodb;
