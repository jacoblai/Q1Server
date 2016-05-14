var basicAuth = require('basic-auth');
var usercon = require('../Controller/UserController.js');
module.exports = function (req, res, next) {
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401);
    };
    var user = basicAuth(req);
    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    };
    //用记登陆身份验证
    usercon.GetUserInfo(user.name, user.pass, function (err, doc) {
        if (!err && doc !== null) {
            return next();
        } else {
            return unauthorized(res);
        }
    });
};