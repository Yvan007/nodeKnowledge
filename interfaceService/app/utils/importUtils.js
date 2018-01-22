
/*
  验证非空
 */
export let  isEmpty=obj=>{
    if(typeof obj=="object"&&JSON.stringify(obj)!="{}"){

        for(let key of Object.keys(obj)){
            if(obj[key].length==0) {
                return true;
            }
        }
    }else if(JSON.stringify(obj)=="{}"){
        return true;
    }else if(!obj){
        return true;
    }
    return false;

}
//判断值是否存在于数组中
export let  isInArray=(arr,value)=>{
    for(var i = 0; i < arr.length; i++){
        if(value === arr[i]){
            return true;
        }
    }
    return false;
}
//计算二维数组内数组长度的乘积
export let arrProduct=arr=>{
    let int = 1;
    for(let value of Object.values(arr)){
        int = int * value.length;
    }
    return int;
}
//获取客户端ip
export let getClientIp =req=>{
    var ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if(ip.split(',').length>0){
        ip = ip.split(',')[0]
    }
    return ip;
}
//验证是否为邮箱
export let isEmail =str =>{
    const reg = /^([a-z0-9])(([-a-z0-9._])*([a-z0-9]))*\@([a-z0-9])*(\.([a-z0-9])([-a-z0-9_-])([a-z0-9])+)*$/i ;
    return reg.test(str);
}
//验证手机号
export let isPhone = str =>{
    const reg = /^(1(([357][0-9])|(47)|[8][012356789]))\d{8}$/;
    return reg.test(str);
}
//将实例变json
export let changeAlltoJson = mod=>{
    for (let i in mod){
        mod[i] = mod[i].toJSON();
    }
    return mod;
}
export let changeOnetoJson = mod=>{
    return mod.toJSON();
}

/**
 * 截取字符串，多余的部分用...代替
 */
export let setString = (str, len) => {
    let StrLen = 0
    let s = ''
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 128) {
            StrLen += 2
        } else {
            StrLen++
        }

        s += str.charAt(i)
        if (StrLen >= len) {
            return s + '...'
        }
    }

    return s
}

//格式化设置
export let OptionFormat = (GetOptions) => {
    let options = '{'
    for (let n = 0; n < GetOptions.length; n++) {
        options = options + '\'' + GetOptions[n].option_name + '\':\'' + GetOptions[n].option_value + '\''
        if (n < GetOptions.length - 1) {
            options = options + ','
        }
    }

    return JSON.parse(options + '}')
}

//数组去重
export let HovercUnique = (arr) => {
    let n = {}
    let r = []
    for (var i = 0; i < arr.length; i++) {
        if (!n[arr[i]]) {
            n[arr[i]] = true
            r.push(arr[i])
        }
    }

    return r
}
//获取json长度
export let getJsonLength = (jsonData) => {
    var arr = []
    for (var item in jsonData) {
        arr.push(jsonData[item])
    }

    return arr.length
}

export let uuid = () => {
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

export let getSecond = () => {
    return Math.round(new Date().getTime() / 1000)
}
const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
function R(number) {
    return chars.charAt(Math.round(Math.random() * number))
}
export let getCode = () => {
    let code = ''
    while(code.length < 6) {
        code += R(9)
    }
    return code
}
export let _getInviteCode = () => {
    let code = ''
    let length = chars.length - 1
    while(code.length < 12) {
        code += R(length)
    }
    return code
}
