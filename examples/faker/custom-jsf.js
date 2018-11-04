var { Chance } = require('chance')
  , faker = require('faker/locale/de')
  , custom = require('./custom')
  , jsf = require('json-schema-faker');

jsf.option({ alwaysFakeOptionals: true })
jsf.extend('chance', () => new Chance());
jsf.extend('faker', () => faker);
jsf.extend('samples', custom(1000));

module.exports = jsf;
