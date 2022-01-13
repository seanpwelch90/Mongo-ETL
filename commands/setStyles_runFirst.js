
const Papa = require('papaparse');
const fs = require('fs');
const mongo = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
let workingDB = 'Products-API';
let workingCollection = 'products';

//----- Read the styles document
let styles = fs.createReadStream('../data/data-big/styles.csv');

// ----- Parse the styles document and add the styles to the respective
MongoClient.connect(url, function (err, client) {

  if (err) throw err;
  var db = client.db(workingDB);

  Papa.parse(styles, {  encoding: 'utf-8', delimiter: ",", header: true, step: (results, parser) => {
    parser.pause();
    console.log('setStyles working on ' + results.data.productId);
    let data = results.data;
    data.photos = [];
    data.skus = [];
    data.productId = Number(data.productId);
    if (data.sale_price !== 'null') { data.sale_price = Number(data.sales_price) } else { data.sale_price = null };
    data.original_price = Number(data.original_price);
    data.id = Number(data.id);
    if (data.default_style === '1') {
      data.default_style = true;
    } else {
      data.default_style = false;
    }
      db.collection(workingCollection).updateOne(
        { product_id: data.productId },
        { $push: { "styles": data } })
        .then((result) => {
          parser.resume();
        });
    },

  complete: (results) => {
    console.log('Complete!')
  }});

});