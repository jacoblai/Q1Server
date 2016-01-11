var express = require('express');
var MongoClient = require('mongodb').MongoClient
var config = require('./config.js');
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

module.exports = (function () {
    'use strict';
    var router = express.Router({ mergeParams: true });
    
    router.route('/add/:db/:coll').post(function (req, res, next) {
        if (Array.isArray(req.body)) {
            mongo.db(req.params.db).collection(req.params.coll).insertMany(req.body, function (err, r) {
                if (err) {
                    res.json({ ok: 0, n : 0, err : err });
                } else {
                    res.json(r.result);
                }
            });
        } else {
            res.json({ ok: 0, n : 0, err : 'only arrays' });
        }
    });
    
    router.route('/update/:db/:coll').post(function (req, res, next) {
        if (req.body.hasOwnProperty('filter') && req.body.hasOwnProperty('update')) {
            var db = req.params.db;
            var coll = req.params.coll;
            mongo.db(db).collection(coll).updateMany(req.body.filter, req.body.update, function (err, r) {
                if (err) {
                    res.json({ ok: 0, n : 0, err : err });
                } else {
                    res.json(r.result);
                }
            });
        } else {
            res.json({ ok: 0, n : 0, err : 'params err' });
        }
    });
    
    router.route('/delete/:db/:coll').post(function (req, res, next) {
        if (req.body.hasOwnProperty('filter')) {
            var db = req.params.db;
            var coll = req.params.coll;
            mongo.db(db).collection(coll).deleteMany(req.body.filter, function (err, r) {
                if (err) {
                    res.json({ ok: 0, n : 0, err : err });
                } else {
                    res.json(r.result);
                }
            });
        } else {
            res.json({ ok: 0, n : 0 });
        }
    });
    
    router.route('/drop/:db/:coll').get(function (req, res, next) {
        var db = req.params.db;
        var coll = req.params.coll;
        mongo.db(db).collection(coll).drop(function (err, r) {
            if (err) {
                res.json({ ok: 0, n : 0, err : err });
            } else {
                res.json(r);
            }
        });
    });
    
    router.route('/search/:db/:coll/:skip/:limit').post(function (req, res, next) {
        if (req.body.hasOwnProperty('filter')) {
            var db = req.params.db;
            var coll = req.params.coll;
            var skip = parseInt(req.params.skip, 10);
            var limit = parseInt(req.params.limit, 10);
            if (isNaN(skip) || isNaN(limit)) {
                res.json({ ok: 0, n : 0, err: "params type err" });
            } else {
                mongo.db(db).collection(coll).find(req.body.filter).skip(skip).limit(limit).toArray(function (err, r) {
                    if (err) {
                        res.json({ ok: 0, n : 0, err : err });
                    } else {
                        res.json({ ok: 1, n : r.length, data: r });
                    }
                });
            }
        } else {
            res.json({ ok: 0, n : 0 });
        }
    });
    
    router.route('/clear/:db/:coll').get(function (req, res, next) {
        var db = req.params.db;
        var coll = req.params.coll;
        mongo.db(db).collection(coll).removeMany(function (err, r) {
            if (err) {
                res.json({ ok: 0, n : 0, err : err });
            } else {
                res.json(r);
            }
        });
    });
    
    router.route('/idx/:db/:coll').post(function (req, res, next) {
        if (req.body.hasOwnProperty('index')) {
            if (!req.body.hasOwnProperty('options')) {
                req.body.options = { background: true };
            }
            var db = req.params.db;
            var coll = req.params.coll;
            mongo.db(db).collection(coll).ensureIndex(req.body.index, req.body.options, function (err, indexName) {
                if (err) {
                    res.json({ ok: 0, n : 0, err : err });
                } else {
                    res.json({ ok: 1, n : 1, data: indexName });
                }
            });
        } else {
            res.json({ ok: 0, n : 0 });
        }
    });

    router.route('/idx/:db/:coll/:idx').get(function (req, res, next) {
        var db = req.params.db;
        var coll = req.params.coll;
        mongo.db(db).collection(coll).dropIndex(req.params.idx, function (err, r) {
            if (err) {
                res.json({ ok: 0, n : 0, err : err });
            } else {
                res.json(r);
            }
        });
    });
    
    return router;
})();