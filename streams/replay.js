/**
 * readable stream: replay file or object n times
 */
var { Readable } = require('stream')
  , CachedFs = require('cachedfs')
  , fs = new CachedFs();

module.exports = function(schema, options = null) {

  let n = 1;
  if (options) {
    n = options.replay || 1;
  }
  if (schema == null) {
    throw `schema undefined: null`;
  }
  if (typeof(schema) === 'string') {
    return new Readable({
      read(size) {
        if (0 < n--) {
          fs.readFile(schema, (err, data) => {
            if (err) {
              this.emit('error', err);
              this.emit('end')
            }
            this.push(data);
          });
        } else {
          this.push(null);
        }
      }
    })
  } else if (typeof(schema) === 'object') {
    return new Readable({
      read(size) {
        if (0 < n--) {
          this.push(JSON.stringify(schema));
          if (n == 0) {
            this.push(null);
          }
        } else {
          this.push(null);
        }
      }
    })
  } else {
    throw `schema: argument type '${typeof(schema)}' not supported`;
  }
}
