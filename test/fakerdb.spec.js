
let fakerdb = require('../index')
  , path = require('path')
  , { expect } = require('chai');

const TOTAL = 10000;
const BLOCK_SIZE = 1000;
const PERSON_SCHEMA = path.join(__dirname, '../examples/schema/person.json');
const OPTS = {
  replay: TOTAL,
  jsft: null,
  insert: {
    blockSize: BLOCK_SIZE
  },
  progress:{
    bar: {
      color: 'green'
    }
  }
}

describe("fakerdb should stream faker generated data into DB", () => {

  describe('nedb', () => {

    let Datasource = require('nedb')
      , db = new Datasource();
    
    it(`should create ${OPTS.replay} records`, done => {
      OPTS.progress.bar.color = 'green';
      fakerdb(db, PERSON_SCHEMA, OPTS, () => {
        db.count({}, (err, num) => {
          expect(num).equals(OPTS.replay);
          done();
        })
      })
    })
  })

  describe('mongodb', () => {
    
    let { MongoClient } = require('mongodb')
      , mongodb_config = {
        url: 'mongodb://localhost:27017',
        options: { useNewUrlParser: true }
      }
      , db, people;

    before('create MongoClient and delete records', done => {
      MongoClient.connect(mongodb_config.url, mongodb_config.options, (err, client) => {
        if(err) {
          return done(err);
        }
        db = client.db('fakerdb');
        people = db.collection("people");
        people.drop();
        done();
      })
    });

    it(`should create ${TOTAL} records`, done => {
      OPTS.progress.bar.color = 'red';
      fakerdb(people, PERSON_SCHEMA, OPTS, () => {
        people.countDocuments({}, (err, numCounted) => {
          if (err) {
            return done(err);
          }
          expect(numCounted).equals(TOTAL);
          done();
        })
      })
    })
  })

  describe('postgres', () => {

    let pg_config = {
        client: 'pg',
        connection: 'postgresql://faker:faker@localhost:5432/fakerdb'
      }
      , knex = require('knex')(pg_config)

    before('run migrations and delete records', done => {
     
      knex.migrate.latest({ directory: './knex/migrations' }).then(
        value => {
          knex('person').delete()
            .then(numCounted => done())
            .catch(err => Console.log(err));
        });
    })

    it(`should create ${TOTAL} records`, done => {
      OPTS.progress.bar.color = 'blue';
      fakerdb(knex('person'), PERSON_SCHEMA, OPTS, () => {
        knex('person').count().then( value => {
          expect(parseInt(value[0].count)).to.equal(TOTAL);
          done();
        })
      })
    })
  })     
  
  describe('mssql', () => {

    let mssql_config = {
        client: 'mssql',
        connection: 
        {
          server: 'localhost',
          // database: 'fakerdb',
          user:     'sa',
          password: 'Faker123',
          port: 1433,
          options: {
            encrypt: false
          }
        }
      }
      , knex = require('knex')(mssql_config)
  
    before('run migrations and delete records', done => {
     
      knex.migrate.latest({ directory: './knex/migrations' }).then(
        value => {
          knex('person').delete()
            .then(numCounted => done())
            .catch(err => Console.log(err));
        });
    })
  
    it(`should create ${TOTAL} records`, done => {
      OPTS.progress.bar.color = 'white';
      fakerdb(knex('person'), PERSON_SCHEMA, OPTS, () => {
        knex('person').count().then(value => {
          expect(value[0]['']).to.equal(TOTAL);
          done();
        })
      })
    })
  })
})
