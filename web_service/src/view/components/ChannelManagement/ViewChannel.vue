<template>
    <div class="perfect-channel">
        <h3>渠道详情</h3>
        <div class="Project-title">
            渠道名称: <span>{{channelTypeOne.type_name}}</span>
        </div>
        <div class="Project-disc">
            渠道描述: <span>{{channelTypeOne.desc}}</span>
        </div>
        <div class="add-channel-btn">
            <button class="btn btn-danger" v-on:click="addChannel">增加渠道根节点</button>
        </div>
        <div class="col-md-12">
            <div class="zTree-box">
                <ul id="channelTree" class="ztree"></ul>
            </div>
            <div class="tree-btn">
                <router-link to="/home/channel"><button class="btn btn-primary" v-on:click="channelTemporaryAdd">暂存</button></router-link>
                <!--<button class="btn btn-success">暂存</button>-->
                <button class="btn btn-danger" v-on:click="submit">提交</button>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .perfect-channel{
        width: 100%;
        padding: 0 15px 15px 15px;
    }
    .perfect-channel .add-channel-btn{
        text-align: left;
        margin-bottom:20px;
    }
    .perfect-channel h3{
        text-align: left;
        padding: 20px 0px;
    }
    .perfect-channel .zTree-box{
        padding:0 0 0 20px;
    }
    .Project-title{
        text-align: left;
        padding: 15px 0 5px 0;
    }
    .Project-title span{
        margin-left:20px;
    }
    .Project-disc{
        text-align: left;
        padding: 5px 0 15px 0;
    }
    .Project-disc span{
        margin-left:20px;
    }

</style>
<script>
  /* eslint-disable camelcase */
  export default {
    data () {
      return {
        channel:{
          channelTypeOne: {},
          arrRes: {}
        },
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
        zNodes:[],
        count: 1,
        channelTypeOne: '',
        resArr: [],
        typeId: this.KNOS.API.getId('channel')
      }
    },
    mounted () {
      const vm = this
      vm.KNOS.API.popLoading()
      // 获得渠道的typeID
      const channelId = vm.typeId
      /* eslint-disable camelcase */
      vm.KNOS.API.post(vm.KNOS.PORT.channelView, {channel_id: channelId}, function (data) {
        // 渠道数据
        vm.channelTypeOne = data.msg.channelTypeOne
        // 暂存后的渠道数据
        vm.zNodes = vm.KNOS.API.loadNodes(data.msg.arrRes, 0)
        $.fn.zTree.init($('#channelTree'), vm.setting, vm.zNodes)
        vm.KNOS.API.removePopLoading()
      })

    },
    methods:{
      // 增加渠道根节点
      addChannel: function () {
        const vm = this
        ++vm.count
        var treeObj = $.fn.zTree.getZTreeObj('channelTree')
        var newNode = {id: vm.count, name: '新根节点', pId: 0, user_type: vm.KNOS.API.getUserType()}
        var newNode = treeObj.addNodes(null, newNode)
        if(newNode){
          treeObj.editName(newNode[0])
        }
      },
      // 暂存数据
      channelTemporaryAdd () {
        this.KNOS.API.popLoading()
        var vm = this
        // 获得全部数据集合
        var treeObj = $.fn.zTree.getZTreeObj('channelTree')
        var allNode = treeObj.getNodes()
        // 循环节点
        vm.resArr = []
        vm.resArr = vm.KNOS.API.subNodes(allNode, vm.resArr, 'channel')
        console.log(vm.resArr)
        vm.KNOS.API.post(vm.KNOS.PORT.channelTemporaryAdd, { channelData: vm.resArr, channelId: vm.typeId }, function () {
          vm.KNOS.API.removePopLoading()
          vm.$router.push('/home/channel')
        })
      },
      // 提交渠道信息入库
      submit: function () {
        const vm = this
        vm.KNOS.API.popConfirm({
          tips: '确认提交？提交后不可修改',
          callback: function () {
            vm.KNOS.API.popLoading()

            // 获得全部数据集合
            var treeObj = $.fn.zTree.getZTreeObj('channelTree')
            var allNode = treeObj.getNodes()
            // 循环节点
            vm.resArr = []
            vm.resArr = vm.KNOS.API.subNodes(allNode, vm.resArr, 'channel')
            console.log(vm.resArr)
            vm.KNOS.API.post(vm.KNOS.PORT.channelCreate, { channelData: vm.resArr, channelId: vm.typeId }, function () {
              vm.KNOS.API.removePopLoading()
              vm.$router.push('/home/channel')
            })
          }
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
          var countId = ++vm.count
          var zTree = $.fn.zTree.getZTreeObj('channelTree')
          var newnode = zTree.addNodes(treeNode, {id: countId, pId:treeNode.id, name:'新子节点' + countId})
          zTree.editName(newnode[0])
          return false
        })
      },
      // 鼠标移除隐藏自定义控件
      removeHoverDom: function (treeId, treeNode) {
        $('#addBtn_'+treeNode.id).unbind().remove()
      },
      beforeRemove: function (treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj('channelTree')
        zTree.selectNode(treeNode)
        return confirm('确定要删除节点 '+treeNode.name + '吗?')
      },
      beforeRename: function (treeId, treeNode, newName, isCancel) {
        if (newName.length == 0) {
          setTimeout(function() {
            var zTree = $.fn.zTree.getZTreeObj('channelTree')
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
