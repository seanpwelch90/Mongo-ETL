const Papa = require('papaparse');
const fs = require('fs');
const mongo = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";

// ----- First connect and add the required fields of arrays (also works to reset the data)
MongoClient.connect(url, function(err, client) {
  if (err) throw err;
  var db = client.db('Products-API');
  db.collection("products_test").updateMany({},
    {$set : {"styles": [], "related_products": [], "features": []}},
    {upsert:false,
    multi:true})
    .then(() => {
      client.close();
    });
});

//----- Read the styles document
let styles = fs.readFileSync('./data/styles_small.csv', { encoding: 'utf-8' });

// ----- Parse the styles document and add the styles to the respective
Papa.parse(styles, { delimiter: ",", header: true, complete: (results) => {
    MongoClient.connect(url, function (err, client) {
      if (err) throw err;
      var db = client.db('Products-API');
      let promises = [];
        results.data.forEach((data) => {
          data.photos = [];
          data.skus = [];
          if (data.default_style === '1') {
            data.default_style = true;
          } else {
            data.default_style = false;
          }
          let thisPromise = new Promise((resolve, reject) => {
            db.collection("products_test").updateOne(
              { product_id: Number(data.productId) },
              { $push: { "styles": data } })
            .then((result) => {
              resolve(result);
            })
            .catch((error) => {
              reject(error);
            });
          });
          promises.push(thisPromise);
      });
      Promise.allSettled(promises).then(() => {
        client.close();
      })
    });
}});


// ----- Read the SKUs document
let skus = fs.readFileSync('./data/skus_small.csv', { encoding: 'utf-8' });

// ----- Parse the SKUs document and add the SKUs to the respective styles
Papa.parse(skus, { delimiter: ",", header: true, complete: (results) => {

    MongoClient.connect(url, function (err, client) {
      if (err) throw err;
      var db = client.db('Products-API');
      let promises = [];
        results.data.forEach((data) => {
          let thisPromise = new Promise((resolve, reject) => {
            db.collection("products_test").updateOne({ styles: {$elemMatch: { id: data.styleId }}}, {$push: {"styles.$.skus" : data }})
            .then((result) => {
              resolve(result);
            })
            .catch((error) => {
              reject(error);
            });
          });
          promises.push(thisPromise);
      });
      Promise.allSettled(promises).then(() => {
        client.close();
      })
    });
}});



let related = fs.readFileSync('./data/related_small.csv', { encoding: 'utf-8' });

// ----- Parse the related document and add the related items to the respective product
Papa.parse(related, { delimiter: ",", header: true, complete: (results) => {

    MongoClient.connect(url, function (err, client) {

      if (err) throw err;
      var db = client.db('Products-API');

      let promises = [];

        results.data.forEach((data) => {
          let thisPromise = new Promise((resolve, reject) => {
            db.collection("products_test").updateOne({ product_id: Number(data.current_product_id) },
            { $push: { "related_products": Number(data.related_product_id) } })
            .then((result) => {
              resolve(result);
            })
            .catch((error) => {
              reject(error);
            });
          });
          promises.push(thisPromise);
      });
      Promise.allSettled(promises).then(() => {
        client.close();
      })
    });
}});

// ----- Read the photo document
let photos = fs.readFileSync('./data/photos_small.csv', { encoding: 'utf-8' });

// ----- Parse the photos document and add the photos to the respective style
Papa.parse(photos, { delimiter: ",", header: true, complete: (results) => {

    MongoClient.connect(url, function (err, client) {

      if (err) throw err;
      var db = client.db('Products-API');
      let promises = [];
        results.data.forEach((data) => {
          let thisPromise = new Promise((resolve, reject) => {
            db.collection("products_test").updateOne({ styles: {$elemMatch: { id: data.styleId }}}, {$push: {"styles.$.photos" : { url: data.url, thumbnail_url: data.thumbnail_url }}})
            .then((result) => {
              resolve(result);
            })
            .catch((error) => {
              reject(error);
            });
          });
          promises.push(thisPromise);
      });
      Promise.allSettled(promises).then(() => {
        client.close();
      })
    });
}});


// ----- Parse the features document and add the features to the features array
let features = fs.readFileSync('./data/features_small.csv', { encoding: 'utf-8' });

Papa.parse(features, { delimiter: ",", header: true, complete: (results) => {

    MongoClient.connect(url, function (err, client) {

      if (err) throw err;
      var db = client.db('Products-API');

      let promises = [];

        results.data.forEach((data) => {
          let thisPromise = new Promise((resolve, reject) => {
            db.collection("products_test").updateOne({ product_id: Number(data.product_id) },
            { $push: { "features": { id: data.id, feature: data.feature, value: data.value } } })
            // { $push: { "features":  data  } })
            .then((result) => {
              resolve(result);
            });
          });
          promises.push(thisPromise);
      });
      Promise.allSettled(promises).then(() => {
        client.close();
      })
    });
}});