<template>
  <div class="SelectLibrary">
    <h3>选择特征库</h3>
    <div class="SelectLibrary-xbox">
      <!--选中的-->
      <div class="SelectLibrary-chose">
        <span class="btn btn-default" v-for="v2 in businessData.industry_info">{{v2.industry_name}}</span>
        <span class="btn btn-default">{{businessData.weight}}</span>
        <!--<button class="btn btn-danger" v-if="this.KNOS.API.isShow(['data'])"> 完善</button>-->
      </div>
      <!--选项卡-->
      <div class="SelectLibrary-topsearch">
        <div class="SelectLibrary-name">
          <span>体系名称:</span>
          <select class="select-w350" id="SelectLibrary-system-list">
            <option value="1">请选择</option>
            <option v-for="key in modleTypeObj" :system-list-id="key.id"  :system-list-nodeId="key.id">{{key.type_name}}</option>
          </select>
        </div>
        <div class="SelectLibrary-channel">
          <span>渠道名称:</span>
          <select class="select-w350" id="SelectLibrary-channel-list">
            <option value="1">请选择</option>
            <option v-for="key in channelData" :channel-list-id="key.id">{{key.type_name}}</option>
          </select>
        </div>
      </div>
      <!--选项卡结束-->
      <div class="SelectLibrary-botmbox">
        <!--树-->
        <div class="SelectLibrary-tree">
          <ul id="systemTree" class="ztree"></ul>
        </div>
        <!--右边-->
        <!--渠道树-->
        <div class="SelectLibrary-qtree">
          <ul id="channelTree" class="ztree"></ul>
        </div>
        <p class="checkTips" v-if="!systemChoseNodes.industry_id || !channelChoseNodes.industry_id"> 请分别双击添加体系和渠道结构图节点 </p>
        <div class="SelectLibrary-content">
          <h4>已选择:</h4>
          <div class="SelectLibrary-weight">
            <div class="weight-left">
              <div class="weight-btn">
                <button class="btn btn-default" v-if="systemChoseNodes.industry_name">{{systemChoseNodes.industry_name}}<span class="dele" v-on:click="deleIndustry">-</span></button>
                <button class="btn btn-default" v-if="channelChoseNodes.industry_name">{{channelChoseNodes.industry_name}}<span class="dele" v-on:click="deleChannel">-</span></button>
              </div>
              <div class="weight-set">
                <span>设置权重 : </span>
                <input type="text" placeholder="0-1" v-model="LibrayWeight">
                <span class="checkTips" v-if="!( parseFloat(LibrayWeight) >= 0 && parseFloat(LibrayWeight) <= 1 )">请输入0~1之间的数字,设置权重</span>
              </div>
            </div>
            <div class="weight-right">
              <button class="btn btn-default" v-on:click="GeneratingLibrary">生成特征库</button>
            </div>
          </div>
          <div class="SelectLibrary-list">
            <h4>业务特征库:</h4>
            <div class="SelectLibrary-listname" v-for="v in characterData">
              <span class="btn btn-default" v-if="v.industry_name">{{ v.industry_name }}</span>
              <span class="btn btn-default" v-if="v.channel_name">{{ v.channel_name}}</span>
              <span class="btn btn-default" v-if="v.weight">{{ v.weight }}</span>
              <span :data-id="v.id" v-on:click="delLibraryData" class="deleBsData">-</span>
            </div>
          </div>
        </div>
        <div class="SelectLibrary-submit">
          <router-link :to="'/home/details?projectId=' + projectId + '_'"><button class="btn btn-primary">暂存</button></router-link>
          <!--<button class="btn btn-success">暂存</button>-->
          <button class="btn btn-danger" v-on:click="LibrarySubmit">提交</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'select-library',
    data () {
      return {
        systemsetting: {
          view:{
            dblClickExpand: false
          },
          callback:{
            onDblClick: this.SystemOnDblClick
          },
          data: {
            simpleData:{
              enable: true,
              idKey: 'id',
              pIdKey: 'pid',
              rootPId: null
            }
          }
        },
        channelsetting: {
          view:{
            dblClickExpand: false
          },
          callback:{
            onDblClick: this.ChannelOnDbliClick
          }
        },
        zNodes:[],
        businessData: [],
        systemChild: [],
        LibrayWeight: '',
        systemChoseNodes: [],
        channelChoseNodes: [],
        channelData: '',
        modleTypeObj: '',
        characterData: '',
        // 模式ID
        businessDataId: '',
        business: this.KNOS.API.getId('business'),
        projectId: this.KNOS.API.getId('project'),
        usrid: this.KNOS.API.getId('usrid'),
        businesstatus: this.KNOS.API.getId('businesstatus')
      }
    },
    mounted () {
      const vm = this
      // 获得模式类型
      console.log(vm.usrid, vm.businesstatus)
      vm.KNOS.API.post(vm.KNOS.PORT.choiceFeatureLibrary, {business_id: vm.business, project_id: vm.projectId, to_user: vm.usrid, status: vm.businesstatus}, function (data) {
        // 模式类型信息
        console.log(data)

        vm.businessData = data.msg.businessData
        // 模式ID
        vm.businessDataId = data.msg.businessData.id
        // 当前节点的体系名称
        vm.modleTypeObj = data.msg.modleTypeObj
        console.log(vm.modleTypeObj)
        // 生成的特征库列表
        vm.characterData = data.msg.characterData
        // 体系对应的所有节点数组
        for (let value of Object.values(vm.modleTypeObj)) {
          vm.systemChild = value.child
        }

        // 渠道列表
        vm.channelData = data.msg.channelData
      })

      // 获取体系树
      $('#SelectLibrary-system-list')[0].onchange = function () {
        const id = $(this).children('option:selected').attr('system-list-id')
        if(!id){
          return
        }
        vm.KNOS.API.popLoading()
        vm.systemId = id
        console.log(vm.businessDataId)
        console.log(vm.modleTypeObj[id].child)
        vm.KNOS.API.post(vm.KNOS.PORT.getIndustryBytype, {type_id: vm.businessDataId, child:vm.modleTypeObj[id].child}, function (data) {
          vm.zNodes = []
          const arr = []
          for(let value of Object.values(data.msg)){
            for(let msg of Object.values(value)){
              arr.push(msg.pid)
              vm.zNodes.push(msg)
            }
          }
          vm.zNodes =  vm.KNOS.API.loadNodes(vm.zNodes, Math.min.apply(null, arr))
          $.fn.zTree.init($('#systemTree'), vm.systemsetting, vm.zNodes)
          vm.KNOS.API.removePopLoading()
        })
      }

      // 获取渠道树
      $('#SelectLibrary-channel-list')[0].onchange = function () {
        const id = $(this).children('option:selected').attr('channel-list-id')
        if(!id){
          return
        }
        vm.KNOS.API.popLoading()
        vm.channelId = id
        vm.KNOS.API.post(vm.KNOS.PORT.channelView, {channel_id: vm.channelId}, function (data) {
          vm.channelTypeOne = data.msg.channelTypeOne
          console.log(data.msg.arrRes)
          vm.zNodes = vm.KNOS.API.loadNodes(data.msg.arrRes, 0)
          console.log(vm.zNodes)
          $.fn.zTree.init($('#channelTree'), vm.channelsetting, vm.zNodes)
          vm.KNOS.API.removePopLoading()
        })
      }
    },
    methods: {
      // 双击体系树取得数据
      SystemOnDblClick (event, treeId, treeNode) {
        var vm = this
        if(treeNode.children){
          vm.KNOS.API.popTips({
            status: 0,
            time: 2000,
            title: '请您选择体系树最小子节点'
          })
          return
        }
        vm.systemChoseNodes = {
          industry_id: treeNode.id,
          industry_name: treeNode.name,
          count_id: treeNode.count_id,
          type_id: treeNode.type_id
        }
      },
      ChannelOnDbliClick (event, treeId, treeNode) {
        var vm = this
        if(treeNode.children){
          vm.KNOS.API.popTips({
            status: 0,
            time: 2000,
            title: '请您选择渠道树最小子节点'
          })
          return
        }
        vm.channelChoseNodes = {
          industry_id: treeNode.id,
          industry_name: treeNode.name,
          count_id: treeNode.count_id,
          type_id: treeNode.type_id
        }
      },
      // 生成特征库
      GeneratingLibrary () {
        const vm = this
        if (!vm.systemChoseNodes.industry_id || !vm.channelChoseNodes.industry_id || !vm.LibrayWeight || !( parseFloat(vm.LibrayWeight) >= 0 && parseFloat(vm.LibrayWeight) <= 1 )) {
          return
        }
        vm.KNOS.API.popLoading()
        vm.KNOS.API.post(vm.KNOS.PORT.featureLibraryCreate, {industry_ids: vm.systemChoseNodes.industry_id, channel_ids: vm.channelChoseNodes.industry_id, weight: vm.LibrayWeight, projectId: vm.projectId, businessId: vm.businessDataId}, function (data) {
          // 生成特征库获得的列表
          // vm.Libraylist = data.msg
          // console.log(vm.Libraylist)
          vm.KNOS.API.post(vm.KNOS.PORT.choiceFeatureLibrary, {business_id: vm.business, project_id: vm.projectId, to_user: vm.usrid, status: vm.businesstatus}, function (data) {
            vm.characterData  = data.msg.characterData
            vm.systemChoseNodes = []
            vm.channelChoseNodes = []
            vm.LibrayWeight = null

            $('#SelectLibrary-channel-list')[0].value = 1
            $('#SelectLibrary-system-list')[0].value = 1
            vm.zNodes = []
            $.fn.zTree.init($('#channelTree'), vm.channelsetting, vm.zNodes)
            $.fn.zTree.init($('#systemTree'), vm.systemsetting, vm.zNodes)


            console.log('....')
            console.log(data)
          })
          vm.KNOS.API.removePopLoading()
        })
      },
      // 提交特征库入库
      LibrarySubmit () {
        const vm = this
        vm.KNOS.API.popConfirm({
          tips: '确认提交?提交后将不可修改',
          callback() {
            vm.KNOS.API.popLoading()
            vm.KNOS.API.post(vm.KNOS.PORT.featureLibrarySubmit, {projectId: vm.projectId, businessId: vm.businessDataId}, function (data) {
              vm.KNOS.API.removePopLoading()
              vm.$router.push('/home/details?projectId='+vm.projectId+'_')
            })
          }
        })

      },
      // 删除体系节点
      deleIndustry () {
        this.systemChoseNodes = {}
      },
      // 删除渠道节点
      deleChannel () {
        this.channelChoseNodes = {}
      },
      // 删除业务特征库
      delLibraryData (e) {
        const vm = this
        const elem = e.target? e.target: e.srcElement
        vm.KNOS.API.popLoading()
        vm.KNOS.API.post(vm.KNOS.PORT.featureLibraryDel, {characterId: $(elem).attr('data-id')}, function () {
          vm.KNOS.API.post(vm.KNOS.PORT.choiceFeatureLibrary, {business_id: vm.business, project_id: vm.projectId, to_user: vm.usrid, status: vm.businesstatus}, function (data) {
            vm.characterData = data.msg.characterData
            vm.KNOS.API.removePopLoading()
            vm.KNOS.API.popTips({
              status: 1,
              title: '删除成功'
            })
          })
        })
      }
    }
  }
</script>

<style scoped>
  .SelectLibrary{
    width: 100%;
    padding: 0 20px;
    text-align: left;
  }
  .SelectLibrary>h3{
    padding: 20px 0;
  }
  .checkTips{
    color: #f00;
    clear: both;
  }
  .SelectLibrary .SelectLibrary-xbox{
    width: 100%;
  }
  .SelectLibrary .SelectLibrary-xbox .SelectLibrary-chose{
    width: 100%;
    /*margin-top: 20px;*/
    /*text-align: left;*/
    /*margin-bottom: 40px;*/
  }
  .SelectLibrary .SelectLibrary-xbox  .SelectLibrary-topsearch{
    width: 100%;
    height: 60px;
    margin-top: 20px;
  }
  .SelectLibrary .SelectLibrary-xbox .SelectLibrary-name{
    float: left;
    margin-right: 20px;
  }
  .SelectLibrary .SelectLibrary-xbox .SelectLibrary-channel{
    float: right;
    margin-right: 10%;
  }
  .SelectLibrary .SelectLibrary-xbox  .SelectLibrary-botmbox{
    width: 100%;
    overflow: hidden;
  }
  .SelectLibrary .SelectLibrary-xbox  .SelectLibrary-botmbox .SelectLibrary-tree{
    min-width: 400px;
    float: left;
  }
  .SelectLibrary .SelectLibrary-xbox  .SelectLibrary-botmbox .SelectLibrary-qtree{
    min-width: 400px;
    float: right;
    margin-right: 10%;
  }
  .SelectLibrary .SelectLibrary-xbox  .SelectLibrary-botmbox .SelectLibrary-content{
    width: 50%;
    height: 400px;
    padding-top: 20px;
    clear: both;
  }
  .SelectLibrary .SelectLibrary-xbox  .SelectLibrary-botmbox .SelectLibrary-content h4{
    width: 100%;
    text-align: left;
  }
  .SelectLibrary .SelectLibrary-xbox  .SelectLibrary-botmbox .SelectLibrary-content  .SelectLibrary-list{
    width: 100%;
    margin-top: 20px;
    height:200px;
    overflow-y: auto;
  }
  .SelectLibrary .SelectLibrary-xbox  .SelectLibrary-botmbox .SelectLibrary-content  .SelectLibrary-list  .SelectLibrary-listname{
    width: 100%;
    margin-top: 20px;
  }
  .SelectLibrary .SelectLibrary-xbox  .SelectLibrary-botmbox .SelectLibrary-content  .SelectLibrary-weight{
    width: 100%;
  }
  .SelectLibrary-xbox  .SelectLibrary-botmbox .SelectLibrary-content  .SelectLibrary-weight  .weight-left{
    width: 80%;
    height: 150px;
    /*float: left;*/
    overflow: hidden;
  }
  /*.SelectLibrary-xbox  .SelectLibrary-botmbox .SelectLibrary-content  .SelectLibrary-weight  .weight-right{*/
  /*!*float: left;*!*/
  /*height: 150px;*/
  /*line-height: 150px;*/
  /*}*/
  .SelectLibrary-botmbox .SelectLibrary-content  .SelectLibrary-weight  .weight-left .weight-btn{
    width: 100%;
    text-align: left;
    margin-top: 20px;
  }
  .SelectLibrary-botmbox .SelectLibrary-content  .SelectLibrary-weight  .weight-left .weight-set{
    width: 100%;
    text-align: left;
    margin-top: 40px;
  }
  .SelectLibrary-botmbox .SelectLibrary-content  .SelectLibrary-weight  .weight-left .weight-set input{
    text-indent: 1rem;
  }
  .SelectLibrary-submit{
    margin: 80px 0 80px 0;
    text-align: center;
  }
  .weight-btn button{
    position: relative;
    margin-left: 20px;
    outline: none;
  }
  button:active{
    outline: none !important;
  }
  .weight-btn button .dele{
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
  .SelectLibrary-list .deleBsData{
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
