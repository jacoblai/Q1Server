var express = require('express');
var morgan = require('morgan');
var config = require('./config.js');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var parseRange = require('range-parser');
var app = express();

function defaultContentTypeMiddleware(req, res, next) {
    req.headers['content-type'] = req.headers['content-type'] || 'application/json';
    next();
}
app.use(defaultContentTypeMiddleware);

if (config.debug) {
    app.use(morgan('tiny'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all('*', function (req, res, next) {
    res.set('Accept-Ranges', 'bytes');
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

function isAuth(req, res, next) {
    // 验证
    var ukey = req.get('U-ApiKey');
    if (ukey === "123") {
        next();
    } else {
        res.status(412);
        res.end();
    }
}

var router = express.Router();

router.get('/dlfn/:fn', function (req, res, next) {
    //var throttle = new Throttle(1024*1024);
    var bucket = new mongodb.GridFSBucket(mongo.db(config.dbName), { bucketName: config.bucketName });
    bucket.find({ filename: req.params.fn }).toArray(function (err, files) {
        if (files.length > 0) {
            if (req.headers.range) {
                var range = parseRange(files[0].length, req.headers.range);
                if (range.type === 'bytes') {
                    res.statusCode = 206;
                    var opt = { start: range[0].start, end: range[0].end };
                } else {
                    res.json({ ok: 0, n: 0, err: 'range type err' });
                }
            } else {
                var opt = { start: 0, end: files[0].length };
            }
            var downloader = bucket.openDownloadStreamByName(req.params.fn, opt);
            res.setHeader('Content-type', files[0].contentType);
            downloader.pipe(res);
        } else {
            res.json({ ok: 0, n: 0, err: 'file not ext' });
        }
    });
});

router.get('/dlid/:id', function (req, res, next) {
    var bucket = new mongodb.GridFSBucket(mongo.db(config.dbName), { bucketName: config.bucketName });
    var o_id = new mongodb.ObjectID(req.params.id);
    bucket.find({ _id : o_id }).toArray(function (err, files) {
        if (files.length > 0) {
            if (req.headers.range) {
                var range = parseRange(files[0].length, req.headers.range);
                if (range.type === 'bytes') {
                    res.statusCode = 206;
                    var opt = { start: range[0].start, end: range[0].end };
                } else {
                    res.json({ ok: 0, n: 0, err: 'range type err' });
                }
            } else {
                var opt = { start: 0, end: files[0].length };
            }
            var downloader = bucket.openDownloadStream(o_id, opt);
            res.setHeader('Content-type', files[0].contentType);
            downloader.pipe(res);
        } else {
            res.json({ ok: 0, n: 0, err: 'file not ext' });
        }
    });
});
router.get('/mg/del/:id', isAuth, function (req, res, next) {
    var bucket = new mongodb.GridFSBucket(mongo.db(config.dbName), { bucketName: config.bucketName });
    var o_id = new mongodb.ObjectID(req.params.id);
    bucket.delete(o_id, function (error) {
        if (error) {
            res.json({ ok: 0, n: 0, err: error });
        } else {
            res.json({ ok: 1, n: 1 });
        }
    });
});

router.get('/mg/drop', isAuth, function (req, res, next) {
    var bucket = new mongodb.GridFSBucket(mongo.db(config.dbName));
    bucket.drop(function (error) {
        if (error) {
            res.json({ ok: 0, n: 0, err: error });
        } else {
            res.json({ ok: 1, n: 1 });
        }
    });
});

app.use('/api', router);

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
    res.json({ ok: 0, n: 0, err: err.message });
});

module.exports = app;
