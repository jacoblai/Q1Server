var mongo = require('../func/mongo.js');

exports.createAdmin = function () {
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
                        console.log('admin created')
                    }
                });
            }
        }
    });
}

exports.GetUserInfoById = function (userId, cb) {
    //用户名密码验证
    mongo().findOne({ userId: userId }, function (err, doc) {
        if (!err && doc !== null) {
            delete doc._id;
            delete doc.pwd;
            return cb(undefined, doc);
        } else {
            return cb(new Error('userid not ext'), undefined);
        };
    });
}

exports.GetUserInfo = function (user, pass, cb) {
    //用户名密码验证
    mongo().findOne({ userId: user, pwd: pass }, function (err, doc) {
        if (!err && doc !== null) {
            delete doc._id;
            delete doc.pwd;
            return cb(undefined, doc);
        } else {
            return cb(new Error('pass err'), undefined);
        };
    });        
}

