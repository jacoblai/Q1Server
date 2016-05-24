module.exports = {
    fieldSize: 1024 * 1024 * 1024,//1G,上传文件大小限制
    chunkSize: 255 * 1024, //255k 
    fileSize: 500 * 1024 * 1024,//form提交最大文件大小默认500m
    fieldNameSize: 1 * 1024,//form提交文件名大小默认1k
    formfileTyps: ['...','.jpg', '.png', '.zip', '.iso','.pdf'],
    mongoPoolSize: 100,
    mongo: 'mongodb://localhost:27017',//使用mongodb数据库
    dbName: 'q1fs',//数据库名称
    bucketName: 'bucket1',
    debug: true,//生产环境下需设置为false
    port: 8080,//本服务端口
    v: '1.0.0',
    ukey:'3aa6bdfb-8b94-49e3-ad16-62bdc070f091',
    appName: 'Q1ServerFsio',
    whitelist: ['0.0.0.0/0', '::ffff:127.0.0.1']//ip白名单，'0.0.0.0/0'开头为禁用此功能
};