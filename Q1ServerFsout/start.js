var http = require('http');
var cluster = require('cluster');
var config = require('./config.js');
var fs = require('fs');
var app = require('./app.js');

var ready = false;

if (config.debug) {
    http.createServer(app).listen(config.port);
    console.log(config.appName + ' is start with port ' + config.port);
} else {
    if (cluster.isMaster) {
        console.log("main process running: pid=" + process.pid);
        var cpus = require('os').cpus().length
        var procs = Math.ceil(0.8 * cpus)
        for (var i = 0; i < procs; i++) cluster.fork();
        cluster.on("exit", function (worker, code) {
            if (code != 0) {
                console.log('Worker %d died :(', worker.id);
                cluster.fork();
            }
        });
        fs.watch(__dirname, function (event, filename) {
            if (event === 'change' && !ready) {
                ready = true;
                console.log(filename);
                setTimeout(function () {
                    delete require.cache[require.resolve('./app.js')];
                    var workers = Object.keys(cluster.workers);
                    for (var i = 0; i < workers.length; i++) {
                        console.log("Killing " + workers[i]);
                        cluster.workers[workers[i]].disconnect();
                        cluster.fork();
                    };
                    ready = false;
                }, 10000);
            }
        });
    } else {
        app.listen(8080);
        console.log(config.appName + ' is start with port ' + config.port + ' pid ' + cluster.worker.id);
    }
}
