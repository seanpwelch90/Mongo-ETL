const Papa = require('papaparse');
const fs = require('fs');
const mongo = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
let workingDB = 'Products-API';
let workingCollection = 'products';

// ----- Read the SKUs document
let skus = fs.createReadStream('../data/data-big/skus.csv');

// ----- Parse the SKUs document and add the SKUs to the respective styles

MongoClient.connect(url, function (err, client) {
  if (err) throw err;
  var db = client.db(workingDB);

  Papa.parse(related, {
    encoding: 'utf-8', delimiter: ",", header: true, step: (results, parser) => {

      parser.pause();
      let data = results.data;
      console.log('Working on ' + data.styleId);

      db.collection(workingCollection).updateOne({ styles: { $elemMatch: { id: data.styleId } } },
        { $push: { "styles.$.skus": data } });

      parser.resume();
    },
    complete: (results) => {
      console.log('complete');
    }
  });

});