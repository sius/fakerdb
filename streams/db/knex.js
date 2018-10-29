const { DbTransform } = require('./dbTransform');

class Knex extends DbTransform {
  
  insert(callback) {
    if (this.chunks.length == 0) {
      callback();
      return;
    }

    this.db.insert(this.chunks).returning('*')
      .then(value => {
        for (let item of value) {
          this.push(item);
        }
        this.chunks = [];
        callback();
      })
      .catch( err => callback(err));
  }
}

module.exports.Knex = Knex;
