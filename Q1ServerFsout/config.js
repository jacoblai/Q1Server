module.exports = {
    fieldSize : 1024 * 1024 * 1024,//1G,上传文件大小限制
    chunkSize : 255 * 1024, //255k 
    mongoPoolSize: 100,
    mongo: 'mongodb://localhost:27017',//使用mongodb数据库
    dbName: 'q1fs',//数据库名称
    bucketName: 'bucket1',
    debug : true,//生产环境下需设置为false
    port: 8080,//本服务端口
    v: '1.0.0',
    ukey: '3aa6bdfb-8b94-49e3-ad16-62bdc070f091',
    appName: 'Q1ServerFsout',
    whitelist: ['0.0.0.0/0', '::ffff:127.0.0.1']//ip白名单，'0.0.0.0/0'开头为禁用此功能
};