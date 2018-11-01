/**
 * transformation stream: generate JSON schema instances from a replayed stream of JSON schema
 * @param jsf - JSON Schema Faker instance
 */
var { Transform } = require('stream');

module.exports = function (options) {

  let jsf = options ? options.jsf : null;
  if (!jsf) {
    jsf = require('json-schema-faker')
    let { Chance } = require('chance')
      , faker = require('faker');
    jsf.extend('faker', () => faker);
    jsf.extend('chance', () => new Chance());
  }
  
  return new Transform({
    readableObjectMode: true,
    writableObjectMode: true,

    transform(chunk, encoding, callback) {

      jsf.resolve(JSON.parse(chunk)).then(
        value => callback(null, JSON.stringify(value)),
        err => callback(err));
    }
  });
}
