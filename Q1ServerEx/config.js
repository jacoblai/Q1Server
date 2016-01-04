module.exports = {
    mongoState: false,
    mongo : 'mongodb://localhost:27017/mydb',//使用mongodb数据库
    redisState: true,//是否启用Redis连接
    redis : 'redis://:jacle169@127.0.0.1:6379',
    debug : true,//生产环境下需设置为false
    port: 8080,//本服务端口
    v : '1.0.0',
    appName: 'Q1Server',
    openLimit: false,//访问速速限制器开关/默认关闭,开启请设置为 true
    limitr: {//配置访问速度限制，默认是每秒1次请求
        limit: 1, //请求数量，接速率允许的请求数量
        rate: 1,//速率，单位/秒
        clientId: 'ip', //default
        //白名单，在此名单内的不会有任任请求限制/必须设置添加你最终的客户端域名，否则客户端没法正常工作。
        ignore: ['127.0.0.1', '192.168.1.1'], 
        //错误返来提示消息内容,返回错误码是429, 如果服务端取不到客户IP会直接返来错误码430
        message: 'Api access rate exted!!'
    }
};