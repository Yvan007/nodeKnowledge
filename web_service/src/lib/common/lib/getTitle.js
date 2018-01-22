import {popTips} from './pop'

export default function (name) {
  const objReg = {
    'project': /projectTitle=(\d+)_/
  }
  const arr = location.hash.match(new RegExp(objReg[name]))
  if(arr !== null && arr.length === 2){
    return arr[1]
  }else{
    popTips({
      status: 0,
      time: 3000,
      title: '获取信息失败, 即将跳转登录页...'
    })
    return null
  }
}
