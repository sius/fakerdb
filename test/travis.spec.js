
let { generate } = require('../')
  , { Nedb, Mongodb, Knex } = require('../streams/db')
  , path = require('path')
  , { expect } = require('chai');

const TOTAL = 100;
const BLOCK_SIZE = 10;
const PERSON_SCHEMA = path.join(__dirname, '../examples/schema/person.json');
const PERSON_OBJ = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      faker: 'name.findName'
    }
  },
  required: [
    'name'
  ]
};

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

    let Datasource = require('nedb'), db;

    beforeEach('create new Datasource', done => {
      db = new Datasource();
      done();
    });

    it(`should create ${OPTS.replay} records with Person schema object`, done => {
      OPTS.progress.bar.color = 'cyan';
      generate(db, PERSON_OBJ, OPTS, () => {
        db.count({}, (err, num) => {
          expect(num).equals(OPTS.replay);
          done();
        })
      })
    })

    it(`should create ${OPTS.replay} records with Person schema file`, done => {
      OPTS.progress.bar.color = 'green';
      generate(db, PERSON_SCHEMA, OPTS, () => {
        db.count({}, (err, num) => {
          expect(num).equals(OPTS.replay);
          done();
        })
      })
    })

    it(`should create ${OPTS.replay} records even if no db was provided`, done => {
      OPTS.progress.bar.color = 'magenta';
      generate(null, PERSON_SCHEMA, OPTS, () => {
        const Datasource = require('nedb');
        const db = new Datasource({ filename: 'faker.db', autoload: true })
        db.count({}, (err, num) => {
          expect(num).gte(OPTS.replay);
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


  describe('postgres', () => {

    let pg_config = {
        client: 'pg',
        connection: 'postgresql://postgres:@localhost:5432/fakerdb'
      }
      , knex = require('knex')(pg_config)

    before('run migrations and delete records', done => {
     
      knex.migrate.latest({ directory: './knex/migrations' }).then(
        value => {
          knex('person').delete()
            .then(numCounted => done())
            .catch(err => console.log(err));
        });
    })

    it(`should create ${TOTAL} records`, done => {
      OPTS.progress.bar.color = 'blue';
      generate(knex('person'), PERSON_SCHEMA, OPTS, () => {
        knex('person').count().then( value => {
          expect(parseInt(value[0].count)).to.equal(TOTAL);
          done();
        })
      })
    })
  })  
})

describe("Error handling", () => {

  it.only('Nedb Transformable should throw an error if the db object is invalid', done => {
    let t =  new Nedb({
      insert(chunks, cb) {
        cb(null, null);
      }
    })
    t.on('error', err => {
      expect(err).equals('db not suppported!');
      done();
    });
    t.write('{}');
  })

  it.only('Nedb Transformable should throw an error if the DB insert results in an error', done => {
    let t =  new Nedb({
      insert(chunks, cb) {
        cb('Connection error', null);
      }
    })
    t.on('error', err => {
      expect(err).equals('Connection error');
      done();
    });
    t.write('{}');
  })

  it.only('Mongodb Transformable should throw an error if the db object is invalid', done => {
    let t =  new Mongodb({
      insertMany(chunks, cb) {
        cb(null, { ops: null });
      }
    })
    t.on('error', err => {
      expect(err).equals('db not suppported!');
      done();
    });
    t.write('{}');
  })

  it.only('Mongodb Transformable should throw an error if the DB insert results in an error', done => {
    let t =  new Mongodb({
      insertMany(chunks, cb) {
        cb('Connection error', null);
      }
    })
    t.on('error', err => {
      expect(err).equals('Connection error');
      done();
    });
    t.write('{}');
  })

  it.only('Knex Transformable should throw an error if the db object is invalid', done => {
    
    let t =  new Knex({
      insert(chunks) {
        return this;
      },
      returning(columns) {
        return new Promise( (resolve, reject) => {
          reject('Connection error');
        });
      }
    })
    t.on('error', err => {
      expect(err).equals('Connection error');
      done();
    })
    t.write('{}');
  })

});
