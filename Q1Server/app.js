var config = require('./config.js');
if (config.debug) {
    var http = require('http');
}
var logger = require('koa-logger');
var koa = require('koa');
var parse = require('co-body');
var cors = require('koa-cors');
var limit = require('koa-better-ratelimit');
var Promise = require('bluebird');
var router = require('koa-router')({
    prefix: '/api'
});
if (config.redisState) {
    var Redis = require('ioredis');
    var redis = new Redis(config.redis);
}
var app = module.exports = koa()

var UserModel = require('./models/admin.js');

app.use(logger());

if (config.limitState) {
    app.use(limit({
        duration: 10, 
        max: config.limitMax
    //blackList: ['127.0.0.1']
    }));
}

app.use(cors());

var mongoose = require('mongoose');
mongoose.connect(config.mongo); 
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("database open ok!!");
});

console.log("Coolpy：V" + config.v);

if (config.redisState) {
    redis.on('connect', function () {
        console.log(redis.status);
    });
}

////sub client 只能在订阅者在线的情况下才能收到消息/消息不缓存
//var sub = new Redis(config.redis);
//sub.subscribe('news', 'music', function (err, count) {
//    console.log(err, count);
//});
//sub.on('message', function (channel, message) {
//    console.log('Receive message %s from channel %s', message, channel);
//});

router
  .get('/', function*(next) {
    if (this.req.checkContinue) this.res.writeContinue();
    //var dt = new Date();
    //for (var i = 0; i < 100; i++) {
    //    redis.set("kkk1" + i, "vvv1" + i);
    //}
    //this.body = (new Date()) - dt;

    ////pub模式
    //redis.publish('news', 'Hello world!');
    //redis.publish('music', 'Hello again!');
    
    ////pop 没有值为null
    //var data = yield redis.lpop('list1');
    //if (data !== null) {
    //    console.log(data);
    //}
    
    var user = yield UserModel.findOne({ userId: "admin" }).exec()
    this.body = user;

    //var data = yield redis.get('kkk199');
    //this.body = { key: 'kkk199', data : data };
    //this.body = "hello world";
})
  .post('/users', function*(next) {
    if (this.req.checkContinue) this.res.writeContinue();
    var body = yield parse.json(this, { limit: '10kb' });
    console.log(this.req.headers['u-apikey']);
    
    var user = yield UserModel.findOne({ userId: "admin" }).exec()
    if (user === null) {
        var admin = new UserModel();
        admin.userId = "admin";
        admin.pwd = "admin";
        admin.userName = "admin";
        admin.email = "admin";
        admin.qq = "admin";
        var result = yield Promise.promisify(admin.save, admin)();
        this.body = result;
    } else {
        this.body = "admin is ext...";
    }

    //yield redis.set("myjson", JSON.stringify(body));
    ////push
    //yield redis.lpush("list1", JSON.stringify(body));
    
    //this.body = JSON.stringify(body);
})
  .put('/users/:id', function*(next) {
    if (this.req.checkContinue) this.res.writeContinue();
    
    var admin = {
        "userId" : "guest",
        "pwd" : "guest",
        "userName" : "admin",
        "email": "guest",
        "qq": "guest"
    }
    delete admin.userName;
    var result = UserModel.findOneAndUpdate({ userId: "admin" }, admin).exec();
    result.then(function (user) {
        this.body = user;
    });
    //this.body = 'Hello ' + this.params.id + '!';
})
  .del('/users/:id', function*(nextxt) {
    if (this.req.checkContinue) this.res.writeContinue();
    var result = UserModel.findOneAndRemove({ userId: "guest" }).exec();
    result.then(function (user) {
        this.body = user;
    });
    //this.body = 'Hello ' + this.params.id + '!';
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.on('error', function (err, ctx) {
    if (config.debug) {
        console.log('server error', err, ctx);
    } else {
        this.status = 404;
        this.body = err;
    }
});

if (config.debug) {
    http.createServer(app.callback()).listen(config.port);
    console.log(config.appName + ' is start with port ' + config.port);
} else {
    app.name = config.appName;
    app.port = config.port;
    app.maxHeadersCount = config.maxHeadersCount;
}