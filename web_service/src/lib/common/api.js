import permission from './lib/permission'
import ajax from './lib/ajax'
import pop from './lib/pop'
import pager from './lib/pager'
import getId from './lib/getId'
import getTitle from './lib/getTitle'
import status from './lib/status'
import zTree from './lib/zTree'
import date from './lib/date'
import checkAll from './lib/checkAll'

export default {
  setToken: permission.setToken,
  getToken: permission.getToken,
  setPermission: permission.setPermission,
  getUserInfo: permission.getUserInfo,
  permissionDenied: permission.permissionDenied,
  checkPermission: permission.checkPermission,
  permissionRoutes: permission.permissionRoutes,
  getUserType: permission.getUserType,
  isShow: permission.isShow,
  setUserId: permission.setUserId,
  getUserId: permission.getUserId,
  get: ajax.get,
  post: ajax.post,
  addModel: pop.addModel,
  distributionModel: pop.distributionModel,
  popTips: pop.popTips,
  popLoading: pop.popLoading,
  removePopLoading: pop.removePopLoading,
  popConfirm: pop.popConfirm,
  removeConfirmSave: pop.removeConfirmSave,
  confirmSave: pop.confirmSave,
  pager: pager,
  getId: getId,
  getTitle: getTitle,
  subNodes: zTree.subNodes,
  loadNodes: zTree.loadNodes,
  getSysStatus: status.getSysStatus,
  getChannelStatus: status.getChannelStatus,
  getProjectStatus: status.getProjectStatus,
  formatDate: date.formatDate,
  checkAll: checkAll
}
