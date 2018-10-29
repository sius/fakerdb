var { Chance } = require('chance')
  , faker = require('faker')
  , jsf = require('json-schema-faker');

jsf.extend('faker', () => faker);
jsf.extend('chance', () => new Chance());
