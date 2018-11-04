
let generate = require('..').generate
  , path = require('path')
  , { expect } = require('chai');

const TOTAL = 100;
const BLOCK_SIZE = 10;
const PERSON_SCHEMA = path.join(__dirname, '../examples/schema/person.json');
const OPTS = {
  replay: TOTAL,
  jsf: null,
  insert: {
    blockSize: BLOCK_SIZE
  },
  progress:{
    bar: {
      color: 'green'
    }
  }
}

describe("fakerdb should stream faker generated data into", () => {

  describe('nedb', () => {

    let Datasource = require('nedb')
      , db = new Datasource();
    
    it(`should create ${OPTS.replay} records`, done => {
      OPTS.progress.bar.color = 'green';
      generate(db, PERSON_SCHEMA, OPTS, () => {
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
        client: 'mongodb',
        connection: 'mongodb://localhost:27017/fakerdb',
        collection: 'people',
        options: { 
          useNewUrlParser: true 
        }
      }
      , people;

    before('create MongoClient and delete records', done => {
      MongoClient.connect(mongodb_config.connection, mongodb_config.options, (err, client) => {
        if(err) {
          return done(err);
        }
        people = client.db().collection(mongodb_config.collection,);
        people.deleteMany({}, (o) => {
          done();
        });
      })
    });

    it(`should create ${TOTAL} records`, done => {
      OPTS.progress.bar.color = 'red';
      generate(people, PERSON_SCHEMA, OPTS, () => {
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
})