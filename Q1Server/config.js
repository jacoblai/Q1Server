module.exports = {
    mongo : 'mongodb://localhost:27017',//使用mongodb数据库
    redisState: true,//是否启用Redis连接
    redis : 'redis://:jacle169@127.0.0.1:6379',
    debug : true,//生产环境下需设置为false
    port: 8080,//本服务端口
    maxHeadersCount: 1000,
    limitState: true,//是否启用访问频率限制
    limitMax: 2,//每毫秒允许多少个访问/生产环境下的计算公式(整数)：每毫秒并发请求数/cpu核心数=本值
    v : '1.0.0',
    appName: 'Q1Server'
};