var mosca = require('mosca');
var config = require('./config.js');

var settings = {
    port: config.port,
    persistence: {
        factory: mosca.persistence.Mongo,
        url: config.mongo
    },
    http: {
        port: 3000,
        bundle: true,
        static: './'
    }
};

var server = new mosca.Server(settings);

server.on("error", function (err) {
    console.log('error : ' +err);
});

server.on('clientConnected', function (client) {
    console.log('Client Connected \t:= ', client.id);
});

server.published = function (packet, client, callback) {
    if (packet.cmd === 'publish') {
        console.log('Published: ', packet.payload.toString('utf8'));
    }
    //if (packet.topic.indexOf('echo') === 0) {
    //    return callback();
    //}
    //if (packet.topic.indexOf('$SYS') === 0) {
    //    return callback();
    //}
    
    //var newPacket = {
    //    topic: 'echo/' + packet.topic,
    //    payload: packet.payload,
    //    retain: packet.retain,
    //    qos: packet.qos
    //};
    
    //console.log(JSON.stringify(newPacket));
    
    //server.publish(packet, callback);
}

server.on('subscribed', function (topic, client) {
    console.log("Subscribed :=", topic);
});

server.on('unsubscribed', function (topic, client) {
    console.log('unsubscribed := ', topic);
});

server.on('clientDisconnecting', function (client) {
    console.log('clientDisconnecting := ', client.id);
});

server.on('clientDisconnected', function (client) {
    console.log('Client Disconnected     := ', client.id);
});

server.on('ready', setup);

function setup() {
    server.authenticate = authenticate;
    //server.authorizePublish = authorizePublish;
    //server.authorizeSubscribe = authorizeSubscribe;
    console.log('MQTT server is up and running');
}

var authenticate = function (client, username, password, callback) {
    if (username == "jac" && password.toString() == "jac")
        callback(null, true);
    else
        callback(null, false);
}

var authorizePublish = function (client, topic, payload, callback) {
    var ukey = topic.split('/')[0];
    //UserModel.findOne({ ukey: ukey }, function (err, u) {
    //    if (u !== null) {
    //        callback(null, true);
    //        //console.log("topic key ok in mqtt server")
    //    } else {
    //        callback(null, false);
    //        //console.log("topic key error in mqtt server")
    //    }
    //});
    return;
}

var authorizeSubscribe = function (client, topic, callback) {
    var ukey = topic.split('/')[0];
    //UserModel.findOne({ ukey: ukey }, function (err, u) {
    //    if (u !== null) {
    //        callback(null, true);
    //        //console.log("topic key ok in mqtt server")
    //    } else {
    //        callback(null, false);
    //        //console.log("topic key error in mqtt server")
    //    }
    //});
    return;
}