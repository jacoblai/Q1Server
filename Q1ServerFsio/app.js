var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var crypto = require('crypto');
var uuid = require('uuid');
var fs = require('fs');
var config = require('./config.js');
var multer = require('multer');
var mongodb = require('mongodb');
var mime = require('mime-types')
var checker = require('./checker.js');
var app = express();

if (config.debug) {
    app.use(morgan('tiny'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

//var tmpdir = __dirname + '\\temp';
//if (!fs.existsSync(tmpdir)) {
//    fs.mkdirSync(tmpdir);
//    console.log('Create dir ' + tmpdir);
//}

//var limit = {
//    fieldSize: config.fieldSize,
//    fieldNameSize: 1 * 1024,
//    headerPairs: 1,
//    fields: 1,
//    fileSize: config.fieldSize,
//    files: 1,
//    parts: 1
//};
//var storage = multer.diskStorage({
//    destination: function (req, file, cb) {
//        cb(null, tmpdir);
//    },
//    filename: function (req, file, cb) {
//        cb(null, path.basename(file.originalname) + '.' + uuid.v4() + '.tmp');
//    }
//});
//var storage = multer.memoryStorage();
//var filter = function fileFilter(req, file, cb) {
//    var ext = path.extname(file.originalname);
//    if (!checker.contains.call(config.fileTyps, ext)) {
//        cb(new Error('file type error'));
//    } else {
//        cb(null, true);
//    }
//}
//var upload = multer({ storage: storage, limits: limit, fileFilter: filter });
//var router = express.Router();

//router.post('/api/upload', upload.single('fieldNameHere'), function (req, res, next) {
//    var opt = {
//        metadata: { encoding : req.file.encoding }, 
//        contentType: mime.lookup(req.file.originalname)
//    }
//    var bucket = new mongodb.GridFSBucket(mongo.db('q1fs'));
//    var upsm = bucket.openUploadStream(req.file.originalname, opt);
//    upsm.write(req.file.buffer, "utf-8", function (err) {
//        upsm.end();
//        delete req.file.buffer;
//    });
//    res.json({ ok : 1, n: 1, data: upsm.id });
    
//    //var upsm = bucket.openUploadStream(req.file.originalname, opt)
//    //var mfs = fs.createReadStream(req.file.path).pipe(upsm).on('error', function (error) {
//    //    res.json({ ok : 0, n: 0, err: error });
//    //}).on('finish', function () {
//    //    fs.unlinkSync(req.file.path);
//    //    res.json({ ok : 1, n: 1, data: upsm.id });
//    //});
//});

//var concat = require('concat-stream');
app.post('/api/upload/:fn', function (req, res, next) {
    var bucket = new mongodb.GridFSBucket(mongo.db('q1fs'));
    var opt = { contentType: mime.lookup(req.params.fn) };
    var uploader = bucket.openUploadStream(req.params.fn, opt);
    req.pipe(uploader).on('error', function (err1) {
        uploader.end();
        var e;
        bucket.delete(uploader.id, function (err2) {
            if (err2) { e = err2; }
            console.log('has delete');
        });
        res.json({ ok: 0, n: 0, err: err1, err1: e });
    }).on('finish', function () {
        res.json({ ok: 1, n: 1, body : { fn: req.params.fn, id: uploader.id } });
    });
});

//app.use(router);

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
