<template>
  <div class="BusinessModel">
    <h3>选择体系</h3>
    <div class="BusinessModel-xbox">
      <!--选项卡-->
      <div class="BusinessModel-choise">
        <span>体系名称:</span>
        <select class="select-w150" id="selectSys">
          <option value="1">请选择</option>
          <option v-for="key in systemList" :data-id="key.id">
            {{key.type_name}}
          </option>
        </select>
        <span class="checkTips" v-if="industryTipsShow">请先选择体系</span>
      </div>
      <!--选项卡结束-->
      <div class="BusinessModel-tree">
        <ul id="tree" class="ztree"></ul>
      </div>
      <span class="checkTips" v-if="!choseNodes.length"> 请双击树状结构图选择节点 </span>
      <div class="BusinessModel-key">
        <h4>已选择:</h4>
        <div class="BusinessModel-btnbox" v-on:click="delNodes">
          <button v-for="v in choseNodes" class="btn btn-default" :data-id="v.count_id">{{v.industry_name}}<span class="dele">-</span></button>
          <!--<button class="btn btn-default">关键字</button>-->
        </div>
        <div class="BusinessModel-Set">
          <span>设置分数:</span>
          <input type="text" placeholder="0-150" class="input-box" v-model="addBsModleData.modleWeight"/>
          <span class="checkTips" v-if="!( parseFloat(addBsModleData.modleWeight) >= 0 && parseFloat(addBsModleData.modleWeight) <= 150 )" v-model="weightTips">请输入0~150之间的数字,设置分数</span>
        </div>
        <div class="Bus-btn">
          <button class="btn btn-success" v-on:click="addBsModle"> 生成业务模式</button>
        </div>
      </div>

      <div class="BusinessModel-model">
        <h3>业务模式</h3>
        <div class="BusinessModel-name" id="bsData">
          <div class="BusinessModel-list" v-for="v1 in businessData">
            <span class="btn btn-default" v-for="v2 in JSON.parse( v1.industry_info )">{{v2.industry_name}}</span>
            <span class="btn btn-default">{{v1.weight}}</span><span :data-id="v1.id" v-on:click="delBsData" class="deleBsData">-</span>
          </div>
        </div>
      </div>

      <div class="BusinessModel-finallsh">
        <router-link to="/home/project"><button class="btn btn-primary">暂存</button></router-link>
        <!--<button class="btn btn-success">暂存</button>-->
        <button class="btn btn-danger" v-on:click="projectSub">提交</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'business-model',

    data() {
      return {
        projectId: this.KNOS.API.getId('project'),
        setting: {
          view:{
            dblClickExpand: false
          },
          callback: {
            // 用于捕获 zTree 上鼠标双击之后的事件回调函数
            onDblClick: this.zTreeOnDblClick
          }
        },
        zNodes:[],
        systemList: '',
        choseNodes: [],
        addBsModleData: {
          modleWeight: '',
          industryIds: [
            {
              industry_id: '',
              industry_name: '',
              count_id: '',
              type_id: ''
            }
          ],
          project_id: this.KNOS.API.getId('project')
        },
        businessData: [],
        weightTips: '',
        nodesTips: '',
        industryTipsShow: true
      }
    },
    mounted () {
      var vm = this
      this.KNOS.API.popLoading()
      this.KNOS.API.post(this.KNOS.PORT.projectViewProject, {'project_id': vm.projectId}, function (data) {
        if(!vm.KNOS.API.getProjectStatus(data.msg.projectData.status).isShow){
          vm.$router.push('/home/project')
        }
        // 体系select
        vm.systemList = data.msg.industryTypeData
        vm.businessData = data.msg.businessData
        vm.KNOS.API.removePopLoading()
      })
      $('#selectSys')[0].onchange = function (e) {
        const id = $(this).children('option:selected').attr('data-id')
        vm.industryTipsShow = false
        if(!id){
          vm.zNodes = []
          $.fn.zTree.init($('#tree'), vm.setting, vm.zNodes)
          vm.industryTipsShow = true
          return
        }
        vm.KNOS.API.popLoading()
        vm.industryId = id
        vm.KNOS.API.post(vm.KNOS.PORT.getIndustry, {typeId: vm.industryId}, function (data) {

          vm.zNodes = vm.KNOS.API.loadNodes(data.msg.arrRes, 0)
          $.fn.zTree.init($('#tree'), vm.setting, vm.zNodes)
          vm.KNOS.API.removePopLoading()
        })
      }
    },
    methods: {
      // 双击体系树取得数据
      zTreeOnDblClick(event, treeId, treeNode){
        var vm = this
        var nodes = {
          industry_id: treeNode.id,
          industry_name: treeNode.name,
          count_id: treeNode.count_id,
          type_id: treeNode.type_id
        }
        console.log(treeNode)
        const treeObj = $.fn.zTree.getZTreeObj('tree')
        // 判断父子节点覆盖
        function cover() {
          var arr = []
          function re(node) {
            arr.push(node.count_id)
            console.log(arr)
            if(node.pid != 0){
              const fNode = treeObj.getNodesByParam('count_id', node.pid, null)[0]
              re(fNode)
            }
            if(node.pid == 0){
              return
            }
          }
          re(treeNode)
          // arr = arr.slice(1)
          for(var i = 0; i < vm.choseNodes.length; i++){
            for(var r = 0; r < arr.length; r++){
              if(vm.choseNodes[i]){
                if(vm.choseNodes[i].count_id == arr[r]){
                  vm.choseNodes.splice(i, 1)
                }
              }
            }
          }

          var arr2 = []
          function re2(node) {
            node = treeObj.getNodesByParam('count_id', node.count_id, null)[0]
            arr2.push(node.count_id)
            console.log(node)
            if(node.children){
              for(var i = 0; i < node.children.length; i++){
                arr2.push(node.children[i].count_id)
                re2(node.children[i])
              }
            }
            if(!node.children){
              return
            }
          }
          re2(treeNode)

          console.log(arr2)
          for(var i = 0; i < vm.choseNodes.length; i++){
            for(var r = 0; r < arr2.length; r++){
              if(vm.choseNodes[i]){
                if(vm.choseNodes[i].count_id == arr2[r]){
                  vm.choseNodes.splice(i, 1)
                }
              }
            }
          }
        }
        cover()
        vm.choseNodes.push(nodes)

        // console.log(vm.choseNodes)
      },
      // 生成业务模式
      addBsModle(){
        const vm = this
        function checkAddData() {
          if(!vm.addBsModleData.modleWeight){
            vm.weightTips = ''
            return false
          }
          if(!vm.choseNodes.length){
            return false
          }
          if(vm.addBsModleData.modleWeight && vm.choseNodes.length){
            return true
          }
        }
        if(checkAddData()){
          vm.KNOS.API.popLoading()
          vm.addBsModleData.industryIds = JSON.stringify( vm.choseNodes )
          vm.KNOS.API.post(vm.KNOS.PORT.addBusinessModle, vm.addBsModleData, function (data) {
            console.log(data)
            vm.businessData = data.msg.businessData
            vm.choseNodes = []
            $('#selectSys')[0].value =1
            vm.addBsModleData.modleWeight = null
            vm.zNodes = []
            $.fn.zTree.init($('#tree'), vm.setting, vm.zNodes)
            vm.KNOS.API.removePopLoading()
          })
        }
      },
      delNodes(e){
        const vm = this
        const elem = e.target ? e.target : e.srcElement
        if(elem.nodeName === 'SPAN'){
          const delCountId = $(elem).parent().attr('data-id')
          for(var i = 0; i < vm.choseNodes.length; i++){
            if(vm.choseNodes[i].count_id == delCountId){
              vm.choseNodes.splice(i, 1)
            }
          }
        }
      },
      delBsData(e){
        const vm = this
        const elem = e.target? e.target: e.srcElement
        vm.KNOS.API.popLoading()
        vm.KNOS.API.post(vm.KNOS.PORT.deleteBusinessModel, {businessId: $(elem).attr('data-id')}, data => {
          vm.KNOS.API.post(vm.KNOS.PORT.projectViewProject, {project_id: vm.projectId}, data => {
            console.log(data)
            vm.businessData = data.msg.businessData
          })
          vm.KNOS.API.removePopLoading()
          vm.KNOS.API.popTips({
            status: 1,
            title: '删除成功'
          })
        })
      },
      // 提交业务模式
      projectSub(){
        const vm = this
        vm.KNOS.API.popConfirm({
          tips: '确认提交?提交后将不可修改',
          callback (){
            vm.KNOS.API.popLoading()
            vm.KNOS.API.post(vm.KNOS.PORT.projectSubmit, {projectId: vm.projectId}, data => {
              vm.$router.push('/home/project')
              vm.KNOS.API.removePopLoading()
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  input{
    text-indent: 1rem;
  }
  h3{
    margin: 15px 0;
  }
  .BusinessModel{
    width: 100%;
    text-align: left;
    padding: 0 20px;
  }
  .BusinessModel>h3{
    text-align: left;
    padding: 20px 0;
  }
  .BusinessModel .BusinessModel-xbox{
    width: 100%;
  }
  .BusinessModel .BusinessModel-xbox .BusinessModel-choise{
    width: 100%;
    margin-right: 20px;
  }
  .BusinessModel .BusinessModel-xbox  .BusinessModel-tree{
    width: 400px;
    margin-top: 20px;
    background: #D9EDF7;
  }
  .BusinessModel .BusinessModel-xbox  .BusinessModel-key{
    width: 100%;
    margin-top: 20px;
  }
  .BusinessModel .BusinessModel-xbox  .BusinessModel-key h4{
    text-align: left;
  }
  .BusinessModel .BusinessModel-xbox  .BusinessModel-key  .BusinessModel-btnbox{
    width: 100%;
    margin-top: 20px;
    text-align: left;
  }
  .BusinessModel .BusinessModel-xbox  .BusinessModel-key  .BusinessModel-btnbox button {
    outline: none !important;
  }
  .BusinessModel .BusinessModel-xbox  .BusinessModel-key  .BusinessModel-Set{
    width: 100%;
    margin-top: 20px;
    text-align: left;
  }
  .BusinessModel .BusinessModel-xbox  .BusinessModel-key  .Bus-btn{
    width: 100%;
    margin-top: 20px;
    text-align: left;
  }
  .BusinessModel .BusinessModel-xbox  .BusinessModel-model{
    width: 100%;
    margin-top: 20px;
  }
  .BusinessModel .BusinessModel-xbox  .BusinessModel-model  .BusinessModel-name{
    width: 100%;
    height: 200px;
    border: 1px solid #ccc;
    padding-left: 8px;
    border-radius: 5px;
    overflow-y: auto;
  }
  .BusinessModel .BusinessModel-xbox  .BusinessModel-model  .BusinessModel-name  .BusinessModel-list{
    margin-top: 6px;
    text-align: left;
  }
  .BusinessModel .BusinessModel-xbox  .BusinessModel-finallsh{
    width: 100%;
    float: left;
    margin:40px 0 180px 0;
    text-align: center;
  }
  .checkTips{
    color: #f00;
  }
  .BusinessModel-btnbox button{
    position: relative;
    margin-left: 20px;
  }
  .BusinessModel-btnbox button .dele{
    width: 14px;
    height: 14px;
    line-height: 13px;
    text-align: center;
    border-radius: 50%;
    font-size: 20px;
    top: -6px;
    right: -6px;
    color: #fff;
    position: absolute;
    background-color: #e4393c;
  }
 .BusinessModel-name .deleBsData{
   width: 14px;
   height: 14px;
   font-size: 20px;
   text-align: center;
   line-height: 12px;
   display: inline-block;
   background-color: #e4393c;
   border-radius: 50%;
   color: #fff;
   margin-left: 20px;
   cursor: pointer;
 }
</style>
