
const Papa = require('papaparse');
const fs = require('fs');
const mongo = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
let workingDB = 'Products-API';
let workingCollection = 'products';

let features = fs.createReadStream('../data/data-big/features.csv');

MongoClient.connect(url, function (err, client) {
  if (err) throw err;
  var db = client.db(workingDB);

  Papa.parse(features, { encoding: 'utf-8',
    delimiter: ",", header: true, step: (results, parser) => {
      parser.pause();

      let data = results.data;
      console.log('setFeatures working on ' + data.product_id);

      db.collection(workingCollection).updateOne({ product_id: Number(data.product_id) },
        { $push: { "features": { id: Number(data.id), feature: data.feature, value: data.value } } })
      parser.resume();
    },

    complete: (results) => {
      console.log('complete');
    }
  });

});