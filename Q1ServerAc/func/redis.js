var Redis = require('ioredis');
var config = require('../config.js');

var redis = new Redis(config.redis);
redis.on('connect', function () {
    console.log('redis state : ' + redis.status);
});
redis.on('error', function () {
    console.log('redis state : ' + redis.status);
});
module.exports = function (){
    return redis;
}