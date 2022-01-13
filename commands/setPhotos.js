
const Papa = require('papaparse');
const fs = require('fs');
const mongo = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
let workingDB = 'Products-API';
let workingCollection = 'products';


// ----- Read the photo document
let photos = fs.createReadStream('../data/data-big/photos.csv');

// ----- Parse the photos document and add the photos to the respective style
MongoClient.connect(url, function (err, client) {
  if (err) throw err;
  var db = client.db(workingDB);

  Papa.parse(photos, {
    encoding: 'utf-8', delimiter: ",", header: true,

    step: (results, parser) => {
      parser.pause();

      console.log('SetPhotos Working on ' + results.data.styleId);
      let data = results.data;

      db.collection(workingCollection).updateOne({ styles: { $elemMatch: { id: Number(data.styleId) } } }, { $push: { "styles.$.photos": { url: data.url, thumbnail_url: data.thumbnail_url } } }).then((result) => {
        parser.resume();
      });

    },
    complete: (results) => {
      console.log('Complete!')
      client.close();
    }
  });

});