const Papa = require('papaparse');
const fs = require('fs');
const mongo = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
let workingDB = 'Products-API';
let workingCollection = 'products';

// MongoClient.connect(url, function(err, client) {
//   if (err) throw err;
//   var db = client.db(workingDB);
//   db.collection(workingCollection).updateMany({},
//     {$set : {"styles": [], "related_products": [], "features": []}},
//     {upsert:false,
//     multi:true})
//     .then(() => {
//       client.close();
//     });
// });

MongoClient.connect(url, function(err, client) {
  if (err) throw err;
  var db = client.db(workingDB);
  db.collection(workingCollection).updateMany({},
    {$set : {"related_products": []}},
    {upsert:false,
    multi:true})
    .then(() => {
      client.close();
    });
});