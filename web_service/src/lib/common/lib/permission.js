import { getCookie } from './cookie'
import Vue from 'vue'
// 设置权限
export function setPermission(user) {
  const arr = {
    // 行业专家
    expert: 70,
    // 数据管理员
    admin: 60,
    // 数据经理
    manager: 50,
    // 数据专员
    data: 40
  }
  if(arr[user]){
    for(;;){
      const _per = Math.random()
      const str = String(_per).slice(2)
      var r = 0
      for(let i = 0; i < str.length; i++){
        r += parseInt( str[i] )
      }
      if( r === arr[user]) {
        document.cookie = ('_per=' + _per + '_per')
        break
      }
    }
  }else{
    console.log( `权限设置错误，permission.js >> ${user} >> ${arr[user]}`)
  }
}



export function setToken(token) {
  document.cookie = '_tkey=' + token + '_tkey'
}
export function getToken() {
  const token = getCookie('_tkey')
  return token
}
export function setUserId(id){
  document.cookie = '_uId=' + id + '_uId'
}
export function getUserId() {
  const uId = getCookie('_uId')
  return uId
}
// 获取权限
export function getUserInfo() {

  const arr = {
    '70': 'expert',
    '60': 'admin',
    '50': 'manager',
    '40': 'data'
  }
  if(getCookie('_per') === null){
    return
  }
  const str = getCookie('_per').slice(2)
  var r = 0
  for(let i = 0; i < str.length; i++){
    r += parseInt( str[i] )
  }
  if(arr[r+''] !== undefined){
    // 返回名
    return arr[r+'']
  }else{
    return null
  }
}

export function getUserType() {
  var arr = [
    {1: '超级管理员'},
    {2: 'expert'},
    {3: 'admin'},
    {4: 'data'},
    {5: 'manager'}
  ]

  for (var i = 0; i < arr.length; i++) {
    for (var key in arr[i]) {
      if ( arr[i][key] == getUserInfo()) {
        return key
      }
    }
  }
  return null
}




// 是否展示按钮

export function isShow(arr) {
  for(let i = 0; i<arr.length; i++){
    if(getUserInfo() === arr[i]){
      return true
    }
  }
  return false
  // return true

}
// 权限对照表
function writePermission() {
  const commonRoutes = [
    '/index',
    '/table',
    '/home',
    '/tree',
    '/home/channel',
    '/home/welcome',
    '/home/system',
    '/home/systemdel',
    '/home/project',
    '/home/details',
    '/home/brary',
    '/home/tion',
    '/home/lect',
    '/home/model',
    '/home/channel',
    '/home/table',
    '/home/perfectchannel',
    '/home/perfectsystem',
    '/home/viewchannel',
    '/home/checklibrary',
    '/home/selectCase'
  ]
  var obj = {
    admin: [],
    expert: [],
    manager: [],
    data: []
  }
  for (let key in obj) {
    obj[key] = obj[key].concat(commonRoutes)
  }
  return obj
}

export const permissionRoutes = writePermission()



// 权限检查
export function checkPermission(userInfo, to, from, next) {
  try{
    ( permissionRoutes[userInfo].indexOf(to.path) !== -1 )
      ? next()
      : permissionDenied(userInfo, to, from, next)
  }catch (e){
    e.msg = 'permission -> checkPermission  ERR'
    console.log(e)
  }
}

// 无权限处理方法
export function permissionDenied(userInfo, to, from, next) {
  alert( `角色${userInfo} : 没有权限, 请登录!` )
  // 去登录页
  next('/')
}

export default {
  setToken,
  getToken,
  setPermission,
  getUserInfo,
  permissionDenied,
  checkPermission,
  permissionRoutes,
  isShow,
  getUserType,
  setUserId,
  getUserId
}
