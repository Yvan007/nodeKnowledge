/* eslint-disable camelcase */
import getId from './getId'
export function subNodes(treeObj, arr, typeName) {
  $.each(treeObj, function(index, val){
    var is_parent = val.isParent ? 1 : 0
    var pid = val.pId ? val.pId : 0
    var goal ={sysname:val.name, pid:pid, count_id:val.id, is_parent:is_parent, level:val.level, user_type: val.user_type, type_id: getId(typeName)}
    arr.push(goal)
    if(val.children){
      subNodes(val.children, arr, typeName)
    }
  })
  return arr
}

export function loadNodes(simpleNodes, count_id) {
  var tree = []
  var temp
  for(var i = 0; i < simpleNodes.length; i++){
    if(simpleNodes[i].pid == count_id){
      var obj = simpleNodes[i]
      obj.name = simpleNodes[i].sysname
      temp = loadNodes(simpleNodes, simpleNodes[i].count_id, tree)
      if(temp.length > 0){
        obj.children = temp
      }
      tree.push(obj)
    }
  }
  return tree
}






export default {
  subNodes,
  loadNodes
}