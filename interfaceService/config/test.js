/**
 * Created by zhaojinsheng at 2017/12/11 下午3:59
 *
 * Desc :
 */
module.exports =  {
    port : process.env.PORT || 3000,
    token   : 'secret-token',
    session : 'secret-token',
    mongodb: 'mongodb://localhost:27017/',
    db_type: 'mysql',                   //数据库类型
    dbconfig: {
        host     : '192.168.1.32',    //服务器地址
        port     : 3306,           //数据库端口号
        username : 'root',         //数据库用户名
        password : 'tshh@time_stone#$%',     //数据库密码
        database : 'knowlegecms',         //数据库名称
    }
}