var express = require('express');
var Redis = require('ioredis');
var config = require('./config.js');

var redis = new Redis(config.redis);
redis.on('connect', function () {
    console.log('redis state : ' + redis.status);
});
redis.on('error', function () {
    console.log('redis state : ' + redis.status);
});

module.exports = (function () {
    'use strict';
    var router = express.Router({ mergeParams: true });
    
    router.route('/:key/:ttl?').post(function (req, res, next) {
        if (req.params.ttl) {
            var t = parseInt(req.params.ttl);
            if (!isNaN(t)) {
                redis.setex(req.params.key, req.params.ttl, JSON.stringify(req.body));
                res.json({ ok: 1, n : 1 });
            } else {
                res.json({ ok: 0, n : 0, err : 'ttl is not int' });
            }
        } else {
            redis.set(req.params.key, JSON.stringify(req.body));
            res.json({ ok: 1, n : 1 });
        }
    })
	.get(function (req, res, next) {
        redis.get(req.params.key, function (err, data) {
            if (data !== null) {
                res.json({ ok: 1, n : 1, body : JSON.parse(data) });
            } else {
                res.json({ ok: 0, n : 0, err: err });
            }
        });
    })
    .delete(function (req, res, next) {
        redis.del(req.params.key, function (err, data) { 
            if (data !== null) {
                res.json({ ok: 1, n : 1 });
            } else {
                res.json({ ok: 0, n : 0, err: err });
            }
        });
    });
    
    router.route('/list/:ln').post(function (req, res, next) {
        redis.lpush(req.params.ln, JSON.stringify(req.body));
        res.json({ ok: 1, n: 1, body : req.body });
    })
	.get(function (req, res, next) {
        redis.rpop(req.params.ln, function (err, data) { 
            if (data !== null) {
                res.json({ ok: 1, n : 1, body : JSON.parse(data) });
            } else {
                res.json({ ok: 0, n : 0, err: err });
            }
        });
    });
    
    router.route('/list/bulk/:ln').post(function (req, res, next) {
        if (Array.isArray(req.body)) { 
            var rds = new Redis(config.redis);
            for (var i = 0; i < req.body.length; i++) {
                redis.lpush(req.params.ln, JSON.stringify(req.body[i]));
            };
            res.json({ ok: 1, n : req.body.length });
        } else {
            res.json({ ok: 0, n : 0, err : 'only arrays' });
        }
    });
    
    return router;
})();