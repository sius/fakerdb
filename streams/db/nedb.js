const { DbTransform } = require('./dbTransform');

class Nedb extends DbTransform {
  
  insert(callback) {
    if (this.chunks.length == 0) {
      callback();
      return;
    }

    this.db.insert(this.chunks, (err, data) => {
      if (err) {
        callback(err);
      } else {
        if (!this._isIterable(data)) {
          callback('db not suppported!')
          return;
        } 
        for (let item of data) {
          this.push(item);
        }
        this.chunks = []
        callback();
      }
    });
  }
}

module.exports.Nedb = Nedb;
