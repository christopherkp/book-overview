const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017/', (err, db) => {
  if (err) {
    throw err;
  } 
})
