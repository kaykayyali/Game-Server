# mongo-async
A simple MongoDB client manager compatible with async/await functions.

## Usage

Connecting to MongoDB from an async function:
```javascript
import mongo from 'mongo-async';
const mongoUrl = 'mongodb://localhost/mydb'

async function start() {
  let db = await mongo.connect(mongoUrl);
  // do something with the db
}
```

Connecting to MongoDB outside of an async function:
```javascript
import mongo from 'mongo-async';
const mongoUrl = 'mongodb://localhost/mydb'

mongo
  .connect(mongoUrl)
  .then(db => console.log(`Connected to ${config.mongodb}`))
  .catch(console.log);
```

Using a database:
```javascript
import mongo from 'mongo-async';
async function doStuff() {
  let db = await mongo.db();

  // do stuff with db
}
```

Or using a collection:
```javascript
import mongo from 'mongo-async';
async function doStuff() {
  let collection = await mongo.collection('items');

  // do stuff with collection
}
```

Future enhancements...
* Make connect idempodent
* await for db/collection methods that resolve when the connection has been established
