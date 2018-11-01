# fakerdb

Generate an unlimited stream of JSON schema instances using [json-schema-faker](https://www.npmjs.com/package/json-schema-faker), [faker](https://www.npmjs.com/package/faker), [chance](https://www.npmjs.com/package/chance) and insert them into a supported database, e.g.: [nedb](https://www.npmjs.com/package/nedb), [mongodb](https://www.npmjs.com/package/mongodb), [postgres](https://www.npmjs.com/package/pg), [mssql](https://www.npmjs.com/package/mssql).

## Getting Started

```console
npm install

# run docker container
docker-compose up -d

npm test

# stop docker container
docker-compose down
```
### Test Results and Performance


JSON schema

```json
// person.json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "faker": "name.findName"
    }
  },
  "required": [
    "name"
  ]
}
```

#### Insert 10^5 Records

![insert 10.000 generated person records](./docs/fakerdb-test-10_5.png)


#### Insert 10^6 Records

![insert 100.000 generated person records](./docs/fakerdb-test-10_6.png)


#### Insert 10^7 Records 

![insert 1.000.000 generated person records](./docs/fakerdb-test-10_7.png)


## API Usage

###  Stream to STDOUT

```javascript
// examples/faker-stdout.js

var { replay, jsf} = require('../')
, faker = require('faker')
, jsonSchemaFaker = require('json-schema-faker')
, path = require('path');

jsonSchemaFaker.extend('faker', () => faker);

const SCHEMA_OBJ = {
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

replay(SCHEMA_OBJ, { replay: 2 })
  .pipe(jsf(jsonSchemaFaker))
  .pipe(process.stdout);

const SCHEMA_FILE = path.join(__dirname, './schema/person.json');
replay(SCHEMA_FILE, { replay: 2 })
    .pipe(jsf(jsonSchemaFaker))
    .pipe(process.stdout);

```

### Stream to file with nedb

```javascript
// examples/faker-nedb.js

let { generate }  = require('../')
  , Datasource = require('nedb')
  , db = new Datasource({ filename: 'faker.db', autoload: true })
  , path = require('path');

const REPLAY = 1000;
const SCHEMA  = path.join(__dirname, './schema/person.json');
const OPTS = { replay: REPLAY, insert: { blockSize: 1000 } };

generate(db, SCHEMA, OPTS);
```

### Stream to database

- [PostgreSQL](./examples/faker-pg.js)
- [MongoDb](./examples/faker-mongodb.js)


### Custom json-schema-faker

TODO

## CLI

```console
fakerdb --help
```
