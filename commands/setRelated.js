
const Papa = require('papaparse');
const fs = require('fs');
const mongo = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
let workingDB = 'Products-API';
let workingCollection = 'products';

let related = fs.createReadStream('../data/data-big/related.csv');
// ----- Parse the related document and add the related items to the respective product

MongoClient.connect(url, function (err, client) {
  if (err) throw err;
  var db = client.db(workingDB);

  Papa.parse(related, {
    encoding: 'utf-8', delimiter: ",", header: true, step: (results, parser) => {

      parser.pause();
      let data = results.data;
      let num = data.related_product_id;
      console.log('Working on ' + data.current_product_id);

      db.collection(workingCollection).updateOne({ product_id: data.current_product_id },
        { $push: { "related_products": num } })

      parser.resume();

    },
    complete: (results) => {
      console.log('complete');
    }
  });

});