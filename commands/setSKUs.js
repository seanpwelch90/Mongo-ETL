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

  Papa.parse(skus, {
    encoding: 'utf-8', delimiter: ",", header: true, step: (results, parser) => {

      parser.pause();
      let data = results.data;
      console.log('SKUs Working on ' + data.styleId);
      data.id = Number(data.id);
      data.styleId = Number(data.styleId);
      data.quantity = Number(data.quantity);

      db.collection(workingCollection).updateOne({ styles: { $elemMatch: { id: data.styleId } } },
        { $push: { "styles.$.skus": data } }).then((result) => {
          parser.resume();
        });
    },
    complete: (results) => {
      console.log('complete');
      client.close();
    }
  });

});