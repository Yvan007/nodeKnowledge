// 体系状态
export function getSysStatus(status) {
  var arr = [
    {1: {msg: '未完善', isShow: true}},
    {2: {msg: '已创建', isShow: false}},
    {3: {msg: '已分配', isShow: false}},
    {4: {msg: '已完善', isShow: false}}
  ]
  // status === 1　?　arr[0].1 : status === 2 ? arr[1].2 ? status ===3 ? arr[2].3 ? status ===4 ?
  for(var i = 0; i < arr.length; i++){
    for(var k in arr[i]){
      if( k == status){
        return arr[i][k]
      }
    }
  }
}


export function getChannelStatus(status) {
  var arr = [
    {1: {msg: '未完善', isShow: true}},
    {2: {msg: '已创建', isShow: false}},
    {3: {msg: '已分配', isShow: false}},
    {4: {msg: '已完善', isShow: false}}
  ]
  // status === 1　?　arr[0].1 : status === 2 ? arr[1].2 ? status ===3 ? arr[2].3 ? status ===4 ?
  for(var i = 0; i < arr.length; i++){
    for(var k in arr[i]){
      if( k == status){
        return arr[i]
      }
    }
  }
}

export function getProjectStatus(status) {
  var arr = [
    {1: {msg: '项目已创建', isShow: true}},
    {2: {msg: '业务模式已创建', isShow: false}},
    {3: {msg: '业务模式分配完成', isShow: false}},
    {4: {msg: '选择特征库已有完成项', isShow: false}},
    {5: {msg: '选择特征库已结束', isShow: false}},
    {6: {msg: '选择特征库分配已完成', isShow: false}},
    {7: {msg: '特征库详单已提交', isShow: false}},
    {8: {msg: '项目已结束', isShow: false}}
  ]
  // status === 1　?　arr[0].1 : status === 2 ? arr[1].2 ? status ===3 ? arr[2].3 ? status ===4 ?
  for(var i = 0; i < arr.length; i++){
    for(var k in arr[i]){
      if( k == status){
        return arr[i][k]
      }
    }
  }
}


export default {
  getSysStatus,
  getChannelStatus,
  getProjectStatus
}
