const Papa = require('papaparse');
const fs = require('fs');
const mongo = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
let workingDB = 'Products-API';
let workingCollection = 'products_test';

