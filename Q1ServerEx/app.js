var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var Redis = require('ioredis');
var config = require('./config.js');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

function defaultContentTypeMiddleware(req, res, next) {
    req.headers['content-type'] = req.headers['content-type'] || 'application/json';
    next();
}
app.use(defaultContentTypeMiddleware);

app.all('*', function (req, res, next) {
    if (!req.get('Origin')) return next();
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.set('Access-Control-Allow-Headers', 'U-ApiKey, Content-Type');
    // res.set('Access-Control-Allow-Max-Age', 3600);
    if ('OPTIONS' == req.method) return res.status(200).end();
    next();
});

if (config.whitelist[0] != '0.0.0.0/0') {
    var ipfilter = require('express-ipfilter');
    var setting = { mode: 'allow', log: false, errorCode: 403, errorMessage: '' };
    app.use(ipfilter(config.whitelist, setting));
}

// get an instance of router
var router = express.Router();

//账号管理api
router.route('/user')
    //Content-Type 必须为application/json
	.post(function (req, res, next) {
    res.json({ Error: 'userid dont use post' });
})
	.get(function (req, res, next) {
    
    var redis = new Redis('redis://:jacle169@127.0.0.1:6379');
    var dt = new Date();
    for (var i = 0; i < 1 * 10000; i++) {
        redis.set('foox' + i, 'barx' + i);
    };
    console.log((new Date()) - dt)
    res.json({ Error: 'userid dont use get' });
    res.end("hello world");
})

    .put(function (req, res, next) {
    res.json({ Error: 'userid dont use put' });
})

    .delete(function (req, res, next) {
    res.json({ Error: 'userid dont use delete' });
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
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
