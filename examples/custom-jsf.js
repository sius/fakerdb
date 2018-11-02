var { Chance } = require('chance')
  , faker = require('faker')
  , jsf = require('json-schema-faker');


faker.custom = {
  name: (options) => {
    return `${options.title || ""} John Doe`;
  }
}

jsf.extend('faker', () => faker);
jsf.extend('chance', () => new Chance());

module.exports = jsf;
