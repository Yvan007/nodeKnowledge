import {popTips} from './pop'

export default function (name) {
  const objReg = {
    // 渠道ID
    'channel': /channelId=(\d+)_/,
    // 项目ID
    'project': /projectId=(\d+)_/,
    // 体系ID
    'system':  /systemId=(\d+)_/,
    // business_id
    'business':  /businessId=(\d+)_/,
    // 详单ID
    'library':  /libraryId=(\d+)_/,
    // 分配人的ID
    'usrid': /usrId=(\d+)_/,
    // 业务模式状态
    'businesstatus': /businesStatus=(\d+)_/,
    // 详单ID
    'charact': /charactId=(\d+)_/,
    // 项目状态
    'projectstatus': /projectStatus=(\d+)_/
  }
  const arr = location.hash.match(new RegExp(objReg[name]))
  if(arr !== null && arr.length === 2){
    return arr[1]
  }else{
    popTips({
      status: 0,
      time: 3000,
      title: '获取' + name + 'Id失败...'
    })
    return null
  }
}
