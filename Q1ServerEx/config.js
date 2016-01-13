module.exports = {
    mongoState: false,
    mongoPoolSize: 100,
    mongo : 'mongodb://localhost:27017',//使用mongodb数据库
    redisState: true,//是否启用Redis连接
    redis : 'redis://:jacle169@127.0.0.1:6379/2',//库0-15
    debug : true,//生产环境下需设置为false
    port: 8080,//本服务端口
    v : '1.0.0',
    appName: 'Q1Server',
    whitelist: ['0.0.0.0/0', '::ffff:127.0.0.1']//ip白名单，'0.0.0.0/0'开头为禁用此功能
};