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
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401);
    };
    //用户登陆并取得token
    router.route('/user/login').get(function (req, res, next){
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
        //使用basic身份验证方式
        var user = basicAuth(req);
        if (!user || !user.name || !user.pass) {
            return unauthorized(res);
        };
        //用户名密码验证
        mongo().findOne({ userId: user.name, pwd: user.pass }, function (err, doc) {
            if (!err && doc !== null) {
                delete doc._id;
                delete doc.pwd;
                //token服务器验证
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

    //刷新token超时时间
    router.route('/user/ref').get(function (req, res, next){
        var token = req.get('token');
        if (token !== undefined && token !== null && token !== '') {
            redis().keys(token + ':*', function (err, tks) {
                if (tks.length === 1) {
                    redis().expire(tks[0], config.tokenex);
                    res.json({ ok: 1, token: token, expire: config.tokenex + 's' });
                } else {
                    res.json({ ok: 0, err: 'key not ext' });
                }
            })
        } else {
            return unauthorized(res);
        }
    })

    //注销token
    router.route('/user/exp').get(function (req, res, next) {
        var token = req.get('token');
        if (token !== undefined && token !== null && token !== '') {
            redis().keys(token + ':*', function (err, tks) {
                if (tks.length === 1) {
                    redis().del(tks[0], function (err, data) {
                        res.json({ ok: 1, token: token, result: 'token was del' });
                    });
                } else {
                    res.json({ ok: 0, err: 'key not ext' });
                }
            })
        } else {
            return unauthorized(res);
        }
    })

    //资源服务器验证token并取得用户资料
    router.route('/user/ver').get(function (req, res, next) {
        var token = req.get('token');
        if (token !== undefined && token !== null && token !== '') {
            redis().keys(token + ':*', function (err, tks) {
                if (tks.length === 1) {
                    redis().get(tks[0], function (err, data) {
                        res.json({ ok: 1, token: token, info: JSON.parse(data) });
                    });
                } else {
                    res.json({ ok: 0, err: 'key not ext' });
                }
            })
        } else {
            return unauthorized(res);
        }
    })

    return router;
})();