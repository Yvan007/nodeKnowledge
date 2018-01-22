/**
 * Created by zhaojinsheng at 2017/12/1 下午12:36
 *
 * Desc :
 */
const path = require("path");
//数据库重置标签 正式环境一定要设为false
export let DB_RESTART_FLAG = false
//管理后台每页返回数据量
export let MANAGER_LIMIT = 10
//忽略检测用户登录和权限的路由
export let NOCHECKURL =["/login"]
//yaml文件存放路径
export let YAMLURL = path.resolve(__dirname,'../../yaml')+"/"
/**网络请求code错误码 */
export const NET = {
    success: function(data) {//请求成功
        return {code:1,msg:data}
    },
    error: function(msg){
        return {code:0,msg:msg}
    },
    ERROR:{
        ERROR_NO_LOGIN                :{code:2,msg:'没有登录'},
        ERROR_NO_PRIVILEGE            :{code:3,msg:'没有权限'},
    }

}