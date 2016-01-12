var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var crypto = require('crypto');
var uuid = require('uuid');
var fs = require('fs-extra');
var config = require('./config.js');
var multer = require('multer');
var mongodb = require('mongodb');
var mime = require('mime-types')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

if (config.debug) {
    app.use(logger('dev'));
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

var uploadpath = __dirname + "\\uploads\\";
if (fs.ensureDirSync(uploadpath)) {
    console.log('Created directory ' + uploadpath);
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

var limit = {
    fieldSize: 10 * 1024 * 1024,//10m
    fieldNameSize: 1 * 1024,
    headerPairs: 1
};
var storage = multer.memoryStorage();
var filter = function fileFilter(req, file, cb) {
    var ext = path.extname(file.originalname);
    if (!contains.call(config.fileTyps, ext)) {
        //var err = new Error('invalid file type');
        //err.status = 400;
        //cb(err);
        cb(null, false);
    } else {
        cb(null, true);
    }
}
var upload = multer({ storage: storage, limits: limit, fileFilter: filter });
var router = express.Router();

router.post('/api/upload', upload.single('fn'), function (req, res, next) {
    var bucket = new mongodb.GridFSBucket(mongo.db('q1fs'), {
        chunkSizeBytes: 70 * 1024, //70k
        bucketName: 'images'
    });
    var opt = {
        metadata: { fieldname : req.file.fieldname, encoding : req.file.encoding }, 
        contentType: mime.lookup(req.file.originalname)
    }
    var upsm = bucket.openUploadStream(req.file.originalname, opt);
    upsm.write(req.file.buffer, "utf-8", function (err) {
        upsm.end();
    });
    res.json({ ok : 1, n: 1, data: upsm.id });
});

app.use(router);

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
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var contains = function (needle) {
    var findNaN = needle !== needle;
    var indexOf;
    if (!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (needle) {
            var i = -1, index = -1;
            for (i = 0; i < this.length; i++) {
                var item = this[i];
                if ((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }
            return index;
        };
    }
    return indexOf.call(this, needle) > -1;
};

module.exports = app;
