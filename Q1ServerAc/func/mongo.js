/**
 * Created by biles on 16/4/8.
 */

var config = require('../config.js');
var MongoClient = require('mongodb').MongoClient;
var mongo;

MongoClient.connect(config.mongo, {
    server: {
        poolSize: config.poolSize
    }
}, function (err, db) {
    if (err === null) {
        mongo = db;
        console.log("Connected correctly to server");
    } else {
        console.log("Connect Error " + err);
    }
});

module.exports = function(){
    return mongo.db(config.mongoDbName).collection(config.mongoColl);
};