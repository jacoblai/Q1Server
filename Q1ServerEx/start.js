var http = require('http');
var cluster = require('cluster');
var app = require('./app.js');
var config = require('./config.js');

if (config.debug) {
    http.createServer(app).listen(config.port);
    console.log(config.appName + ' is start with port ' + config.port);
} else {
    if (cluster.isMaster) {
        var cpus = require('os').cpus().length
        var procs = Math.ceil(0.8 * cpus)
        for (var i = 0; i < procs; i++) cluster.fork()
        cluster.on('exit', function (worker) {
            console.log('Worker %d died :(', worker.id);
            cluster.fork();
        });
    } else {
        app.listen(8080);
        console.log('Worker %d running!', cluster.worker.id);
    }
}
