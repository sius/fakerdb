#!/usr/bin/env node

let argv = require('yargs')
  , path = require('path');

argv
  .option('block-size', {
    alias: 'b',
    describe: `The number of records to insert simultaneously.`,
    default: 1
  })
  .option('client', {
    alias: 'c',
    describe: `Choose a database client.`,
    choices: ['nedb', 'pg', 'mongodb', 'mssql'],
    default: 'nedb'
  })
  .option('connection', {
    alias: 'con',
    describe: `The connection url (1) or path to JSON config file (2), e.g.:`,
  })
  .option('output', {
    alias: 'o',
    describe: `The out path where to write the generated JSON records.`,
    default: 'faker.db'
  })
  .help('help')
  .option('json-schema-faker', {
    alias: ['jsf', 'f'],
    describe: `The path to a custom JSON schema faker javascript file.`
  })
  .option('knex-migrations', {
    alias: 'migrations',
    describe: `The knex migration folder.`,
    default: './knex/migrations'
  })
  .option('mongodb-col-name', {
    alias: 'col-name',
    describe: `The MongoDb collection name.`,
    default: 'records'
  })
  .option('progress-bar-color', {
    alias: 'color',
    describe: `Choose a progress bar color.`,
    choices: ['black', 'white', 'yellow', 'blue', 'cyan', 'gray', 'grey', 'red', 'magenta', 'green'],
    default: 'green'
  })
  .option('replay', {
    alias: 'r',
    describe: `The total number of schema instances to generate.`,
    default: 1
  })
  .option('schema', {
    alias: ['s', 'i'],
    describe: `The path to the JSON schema file.`
  })
  .option('table', {
    alias: 't',
    describe: `The relational table name.`
  })
  .coerce(['schema', 'json-schema-faker', 'output'], path.resolve)
  .command(require('./cmds/generate'))
  .demandCommand()
  .wrap(100)
  .epilog('For more information about json-schema-faker, find out README at https://github.com/json-schema-faker/json-schema-faker')
  .example("fakerdb g -s examples/schema/person.json -r 1000 -b 100 -o people.db", `Generate 1.000 person records and write them to the 'people.db' file,`)
  .example("fakerdb g -s examples/schema/person.json -r 1000 -b 100 --col-name people --con mongodb://localhost:27017/my_db", 'Generate 1.000 person records and write them to my_db')
  .example("fakerdb g -s examples/schema/person.json -r 1000 -b 100 -c pg -t person --con postgresql://faker:faker@localhost:5432/fakerdb", 'Generate 1.000 person records and write them to my_db. The database table person must be created beforehand. For this purpose you can use knex migrations. The migrations folder can be set with the --migrations option.')
  .argv;
