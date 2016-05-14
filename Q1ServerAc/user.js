var express = require('express');
var redis = require('./func/redis.js');
var config = require('./config.js');
var isvalid = require('isvalid');
var deepExtend = require('deep-extend');
var uuid = require('uuid');
var basicAuth = require('basic-auth');
var mongo = require('./func/mongo.js');
var userInfo = require('./models/UserInfo.js');
var usercon = require('./Controller/UserController.js');

module.exports = (function () {
    'use strict';
    var router = express.Router({ mergeParams: true });
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401);
    };

    //用户管理
    router.route('/users/:id?')
        .post(function (req, res, next) {
            isvalid(req.body, userInfo, function (err, validData) {
                if (err) {
                    res.json({ ok: 0, n: 0, err: err });
                } else {
                    //判断用户id是否已经存在
                    usercon.GetUserInfoById(validData.userId, function (err, doc) {
                        if (!doc) {
                            //新账号信息写入到数据库
                            mongo().insertOne(validData, function (er, r) {
                                if (er) {
                                    res.json({ ok: 0, n: 0, err: er });
                                } else {
                                    res.json({ ok: 1, n: 1, result: 'created' });
                                }
                            });
                        } else {
                            res.json({ ok: 0, n: 0, err: 'userid ext' });
                        }
                    })
                }
            });
        })
        .put(function (req, res, next) {
            isvalid(req.body, userInfo, function (err, validData) {
                if (err) {
                    res.json({ ok: 0, n: 0, err: err });
                } else {
                    var filter = Object();
                    filter.userId = validData.userId;
                    mongo().findOne(filter, function (err, doc) {
                        if (err) {
                            res.json({ ok: 0, n: 0, err: err });
                        } else {
                            if (!doc) {
                                res.json({ ok: 0, n: 0, err: "object not exits" });
                            } else {
                                var update = Object();
                                update.$set = validData;
                                mongo().updateOne(filter, update, function (err, r) {
                                    if (err) {
                                        res.json({ ok: 0, n: 0, err: err });
                                    } else {
                                        res.json({ ok: 1, n: 1, result: 'updated' });
                                    }
                                });
                            }
                        }
                    });
                }
            });
        })
        .get(function (req, res, next) {
            if (req.params.id) {
                mongo().findOne({ 'userId': req.params.id }, function (err, doc) {
                    if (err) {
                        res.json({ ok: 0, n: 0, err: err });
                    } else {
                        if (!doc) {
                            res.json({ ok: 0, n: 0, err: "object not exits" });
                        } else {
                            delete doc.pwd;
                            delete doc._id;
                            res.json({ ok: 0, n: 0, obj: doc });
                        }
                    }
                });
            }
        })
        .delete(basicAuth, function (req, res, next) {
            if (req.params.id) {
                mongo().deleteOne({ 'userId': req.params.id }, function (err, doc) {
                    if (err) {
                        res.json({ ok: 0, n: 0, err: err });
                    } else {
                        if (!doc) {
                            res.json({ ok: 0, n: 0, err: "object not exits" });
                        } else {
                            delete doc.pwd;
                            delete doc._id;
                            res.json({ ok: 0, n: 0, obj: doc });
                        }
                    }
                });
            }
        })

    return router;
})();