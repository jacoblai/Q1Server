var express = require('express');

module.exports = (function () {
    'use strict';
    var router = express.Router();
   
    router.route('/user')
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
    
    return router;
})();