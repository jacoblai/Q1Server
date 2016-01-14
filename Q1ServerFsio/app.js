var express = require('express');
var morgan = require('morgan');
var config = require('./config.js');
var mongodb = require('mongodb');
var mime = require('mime-types')
var app = express();

if (config.debug) {
    app.use(morgan('tiny'));
}

app.all('*', function (req, res, next) {
    if (!req.get('Origin')) return next();
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.set('Access-Control-Allow-Headers', 'U-ApiKey, Content-Type');
    //res.set('Access-Control-Allow-Max-Age', 3600);
    if ('OPTIONS' == req.method) return res.status(200).end();
    next();
});

if (config.whitelist[0] != '0.0.0.0/0') {
    var ipfilter = require('express-ipfilter');
    var setting = { mode: 'allow', log: false, errorCode: 403, errorMessage: '' };
    app.use(ipfilter(config.whitelist, setting));
}

var MongoClient = require('mongodb').MongoClient
var mongo;
MongoClient.connect(config.mongo, {
    server: {
        poolSize: config.mongoPoolSize
    }
}, function (err, db) {
    if (err === null) {
        mongo = db;
        console.log("Connected correctly to server");
    } else {
        console.log("Connect Error " + err);
    }
});

app.post('/api/upload/:fn', function (req, res, next) {
    //var throttle = new Throttle(1024*1024);
    var bucket = new mongodb.GridFSBucket(mongo.db('q1fs'));
    bucket.find({ filename: req.params.fn }).toArray(function (err, files) {
        if (files.length === 0) {
            var opt = { contentType: mime.lookup(req.params.fn), metadata: { auth: "user" } };
            var uploader = bucket.openUploadStream(req.params.fn, opt);
            req.pipe(uploader).on('error', function (err) {
                res.json({ ok: 0, n: 0, err: err });
            }).on('finish', function () {
                res.json({ ok: 1, n: 1, body : { fn: req.params.fn, id: uploader.id } });
            });
        } else {
            res.json({ ok: 0, n: 0, err: 'file ext' });
        }
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json(err);
});

module.exports = app;
