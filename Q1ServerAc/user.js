var express = require('express');
var redis = require('./func/redis.js');
var config = require('./config.js');
var isvalid = require('isvalid');
var uuid = require('uuid');
var basicAuth = require('basic-auth');
var mongo = require('./func/mongo.js');
var userInfo = require('./models/UserInfo.js');

module.exports = (function () {
    'use strict';
    var router = express.Router({ mergeParams: true });
    
    router.route('/user/token').get(function (req, res, next){
        //当系统还没有admin超级管理员账号时系统自动构建一个
        mongo().findOne({ userId: 'admin' }, function (err, doc) {
            if (!err) {
                if (doc == null) {
                    var user = Object();
                    user.userId = 'admin';
                    user.pwd = 'admin';
                    mongo().insertOne(user, function (err, r) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(r.result)
                        }
                    });
                }
            }
        });
        function unauthorized(res) {
            res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
            return res.sendStatus(401);
        };
        var user = basicAuth(req);
        if (!user || !user.name || !user.pass) {
            return unauthorized(res);
        };
        mongo().findOne({ userId: user.name, pwd: user.pass }, function (err, doc) {
            if (!err && doc !== null) {
                redis().keys('*:' + doc.userId, function (err, tks){
                    if (tks.length === 0) {
                        var token = uuid.v4();
                        redis().setex(token + ':' + doc.userId, config.tokenex, JSON.stringify(doc));
                        res.json({ ok: 1, token : token, expire: config.tokenex + 's' });
                    } else {
                        redis().ttl(tks[0], function (err, ttl) { 
                            res.json({ ok: 1, token : tks[0].split(":")[0], expire: ttl + 's' });
                        })
                    }
                })
            } else {
                return unauthorized(res);
            };
        });        
    })

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