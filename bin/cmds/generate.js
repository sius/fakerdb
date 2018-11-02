const { generate } = require('../../');
exports.command = 'generate [options]';
exports.aliases = ['gen', 'g'];
exports.describe = 'Start the test data generation stream.';
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
    
    if (/mongodb/i.test(argv.client) || /^mongodb:\/\//.test(argv.con)) {

      const { MongoClient } = require('mongodb')
      MongoClient.connect(argv.con, { useNewUrlParser: true }, (err, client) => {
        if(err) {
          return done(err);
        }
        db = client.db().collection(argv.colName);
        generate(db, argv.schema, options)
      })
    } else {
      if (argv.client != 'nedb') {
        const knex = require('knex')({ client: argv.client, connection: argv.con});
        knex.migrate.latest({ directory: argv.migrations }).then(
          value => {
            generate(knex(argv.table), argv.schema, options)
          }
        )
      } else {
        let Datasource = require('nedb');
        let db = new Datasource({ filename: argv.o, autoload: true })
        generate(db, argv.schema, options);
      }
    }
  };


  //   .option('connection', `The connection url (1) or path to JSON config file (2), e.g.: 
//                                       (1) postgresql://my_db_user:my_db_password@localhost:5432/my_db
//                                       (2) {
//                                             host : 'localhost',
//                                             user : 'my_db_user',
//                                             password : 'my_db_password',
//                                             database : 'my_db',
//                                             port: 1433
//                                             options: { encrypt: false }
//                                           }
//                           `)
