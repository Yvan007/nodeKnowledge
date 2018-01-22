<template>
    <div class="system-del">
        <h3>完善体系</h3>
        <div class="system-title">
            体系名称: <span>{{PerfectSystem.type_name}}</span>
        </div>
        <div class="system-disc">
            体系描述: <span>{{PerfectSystem.desc}}</span>
        </div>
        <div>
            <button class="btn btn-danger add-system-btn" v-on:click="addSystem">增加体系根节点</button>
        </div>
        <div class="col-md-12">
            <div>
                <ul id="systemTree" class="ztree"></ul>
            </div>
            <div class="submit-btn-box">
                <!--<router-link to="/home/system"><button class="btn btn-primary">返回 </button></router-link>-->
                <button class="btn btn-success" v-if="isShow && industryStatus !=4" v-on:click="industryTemporaryAdd">暂存</button>
                <button class="btn btn-danger" v-if="isShow && industryStatus !=4" v-on:click="submit">提交</button>
            </div>
        </div>
    </div>
</template>

<script>
  /* eslint-disable camelcase */
  import Vue from 'vue'
  export default {
    name: 'system',
    data () {
      return {
        setting: {
          view:{
            addHoverDom: this.addHoverDom,
            removeHoverDom: this.removeHoverDom,
            selectedMulti: false
          },
          edit: {
            enable: true,
            editNameSelectAll: true,
            showRemoveBtn: true,
            showRenameBtn: true
          },
          data: {
            simpleData: {
              enable: true
            }
          },
          callback: {
            beforeRename: this.beforeRename,
            beforeRemove: this.beforeRemove
          }
        },
        zNodes: [],
        PerfectSystem: '',
        count: 1,
        resArr: [],
        // 体系状态
        industryStatus: '',
        typeId: this.KNOS.API.getId('system'),
        isShow: this.KNOS.API.isShow(['expert', 'manager'])
      }
    },
    mounted () {
      const vm = this
      const systemId = this.typeId
      console.log(systemId)
      vm.KNOS.API.popLoading()
      this.KNOS.API.post(this.KNOS.PORT.industryPerfectView, {'industry_id': systemId}, function (data) {
        // 绑定数据
        vm.PerfectSystem = data.msg.industryTypeOne
        // 体系状态
        vm.industryStatus = data.msg.industryTypeOne.status
        // 暂存后的树数据
        vm.zNodes = vm.KNOS.API.loadNodes(data.msg.arrRes, 0)
        // 初始化树
        $.fn.zTree.init($('#systemTree'), vm.setting, vm.zNodes)

        // 获取countId
        vm.KNOS.API.removePopLoading()
      })
    },
    methods: {
      // 增加体系根节点
      addSystem: function () {
        const vm = this
        // 提示保存
        vm.KNOS.API.confirmSave()
        ++vm.count
        var treeObj = $.fn.zTree.getZTreeObj('systemTree')
        var newNode = {id: vm.count, name: '新根节点', pId: 0, user_type: vm.KNOS.API.getUserType()}
        var newNode = treeObj.addNodes(null, newNode)
        if(newNode){
          treeObj.editName(newNode[0])
        }
      },
      // 提交体系入库
      submit: function () {
        var vm = this
        vm.KNOS.API.popConfirm({
          tips: '确认提交？提交后不可修改',
          callback: function () {
            vm.KNOS.API.popLoading()

            // 获得全部数据集合
            var treeObj = $.fn.zTree.getZTreeObj('systemTree')
            var allNode = treeObj.getNodes()
            // 循环节点
            vm.resArr = []
            vm.resArr = vm.KNOS.API.subNodes(allNode, vm.resArr, 'system')
            console.log(vm.resArr)
            vm.KNOS.API.post(vm.KNOS.PORT.industryCreat, { industryData: vm.resArr, industryId: vm.typeId }, function () {
              vm.KNOS.API.removePopLoading()
              // 移除提示保存
              vm.KNOS.API.removeConfirmSave()
              vm.$router.push('/home/system')
            })
          }
        })
      },
      // 体系暂存
      industryTemporaryAdd () {
        const vm = this
        // 获得全部数据集合
        var treeObj = $.fn.zTree.getZTreeObj('systemTree')
        var allNode = treeObj.getNodes()
        // 循环节点
        vm.resArr = []
        vm.resArr = vm.KNOS.API.subNodes(allNode, vm.resArr, 'system')
        console.log(vm.resArr)
        vm.KNOS.API.post(vm.KNOS.PORT.industryTemporaryAdd, { industryData: vm.resArr, industryId: vm.typeId }, function () {
          vm.KNOS.API.removePopLoading()
          // 移除提示保存
          vm.KNOS.API.removeConfirmSave()
          vm.$router.push('/home/system')
        })
      },
      // 鼠标移入显示自定义控件
      addHoverDom: function (treeId, treeNode) {
        const vm = this
        var sObj = $('#' + treeNode.tId + '_span')
        if (treeNode.editNameFlag || $('#addBtn_'+ treeNode.tId).length>0) return
        var addStr = '<span class="button add" id="addBtn_' + treeNode.tId
            + '" title="add node" onfocus="this.blur();"></span>'
        sObj.after(addStr)
        var btn = $('#addBtn_' + treeNode.tId)
        // 点击新增节点
        if (btn) btn.bind('click', function(){
          // 提示保存
          vm.KNOS.API.confirmSave()
          var countId = ++vm.count
          var zTree = $.fn.zTree.getZTreeObj('systemTree')
          var newnode = zTree.addNodes(treeNode, {id: countId, pId:treeNode.id, name:'新子节点' + countId})
          zTree.editName(newnode[0])
          return false
        })
      },
      // 鼠标移除隐藏自定义控件
      removeHoverDom: function (treeId, treeNode) {
        $('#addBtn_'+treeNode.tId).unbind().remove()
      },
      beforeRemove: function (treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj('systemTree')
        zTree.selectNode(treeNode)
        return confirm('确定要删除节点 '+treeNode.name + '吗?')
      },
      beforeRename: function (treeId, treeNode, newName, isCancel) {
        if (newName.length == 0) {
          setTimeout(function() {
            var zTree = $.fn.zTree.getZTreeObj('systemTree')
            zTree.cancelEditName()
            alert('节点名称不能为空.')
          }, 0)
          return false
        }
        return true
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .system-del .system-title{
        padding: 15px 0 5px 0;
    }
    .system-del .add-system-btn{
        margin-bottom:20px;
    }
    .system-del .system-title span{
        margin-left:20px;
    }
    .system-del .system-disc{
        padding: 5px 0 15px 0;
    }
    .system-del .system-disc span{
        margin-left:20px;
    }
    .system-del{
        width: 100%;
        display: inline-block;
        padding: 0 15px 15px 15px;
        text-align: left;
    }
    h3{
        margin-top: 20px;
        margin-bottom: 10px;
    }
    .submit-btn-box{
        width: 530px;
        margin: 0 auto;
        margin-top: 20px;
        text-align: center;
    }
</style>
