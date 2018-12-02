const { generate } = require('../../');
exports.command = 'generate [options]';
exports.aliases = ['gen', 'g'];
exports.describe = 'Start the test data generation.';
exports.builder = (yargs) => { };
exports.handler =  (argv) => {
    const options = {
      replay: argv.replay,
      jsf: argv.jsf ? require(argv.jsf) : null,
      insert: {
        blockSize: argv.blockSize
      },
      progress:{
        bar: {
          color: argv.progressBarColor
        }
      }
    }

    const _exit0 = () => process.exit(0);

    if (/mongodb/i.test(argv.client) || /^mongodb:\/\//.test(argv.con)) {

      const { MongoClient } = require('mongodb')
      MongoClient.connect(argv.con, { useNewUrlParser: true }, (err, client) => {
        if(err) {
          console.error(err);
        }
        db = client.db().collection(argv.colName);
        generate(db, argv.schema, options, _exit0)
      })
    } else {
      if (argv.client != 'nedb') {
        const knex = require('knex')({ client: argv.client, connection: argv.con});
        knex.migrate.latest({ directory: argv.migrations }).then(
          value => {
            generate(knex(argv.table), argv.schema, options, _exit0)
          }
        )
      } else {
        let Datasource = require('nedb');
        let db = new Datasource({ filename: argv.o, autoload: true })
        generate(db, argv.schema, options, _exit0);
      }
    }
  };
