<template>
  <div class="system-del">
    <h3>查看体系</h3>
    <div class="Project-title">
      体系名称: <span>{{systemData.type_name}}</span>
    </div>
    <div class="Project-disc">
      体系描述: <span>{{systemData.desc}}</span>
    </div>
    <div class="Project-distribution" v-if="systemData.status >=3">
      {{'分配人: '+ systemData.username +'&nbsp;&nbsp;&nbsp;&nbsp;时间: ' + formatDate(systemData.distribution_time* 1000, 'yyyy-MM-dd hh:mm')}}
    </div>
    <div class="col-md-12">
      <div>
        <ul id="systemTree" class="ztree"></ul>
      </div>
      <div class="submit-btn-box">
        <router-link to="/home/system"><button class="btn btn-primary">返回 </button></router-link>
        <!--<button class="btn btn-success" v-if="this.KNOS.API.isShow(['expert','manager'])">暂存</button>-->
        <!--<button class="btn btn-danger" v-if="this.KNOS.API.isShow(['expert','manager'])">提交</button>-->
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable camelcase */
  export default {
    name: 'system',
    data () {
      return {
        setting: {
          view:{
            dblClickExpand: false
          }
        },
        zNodes:[],
        systemData: '',
        formatDate: this.KNOS.API.formatDate
      }
    },
    mounted () {
      const vm = this
      vm.KNOS.API.popLoading()
      const systemId = this.KNOS.API.getId('system')
      vm.KNOS.API.post(vm.KNOS.PORT.industryView, {'industry_id': systemId}, function (data) {
        vm.systemData = data.msg.industryTypeOne
        console.log(data)

        vm.zNodes = vm.KNOS.API.loadNodes(data.msg.arrRes, 0)
        $.fn.zTree.init($('#systemTree'), vm.setting, vm.zNodes)
        // 获得ztree对象
        const treeObj = $.fn.zTree.getZTreeObj('tree')
        // 打印出对象集合
//        const getSelect = treeObj.getSelectedNodes()

        vm.KNOS.API.removePopLoading()
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .system-del .Project-title{
    padding: 15px 0 5px 0;
  }
  .system-del .Project-title span{
    margin-left:20px;
  }
  .system-del .Project-disc{
    padding: 5px 0 15px 0;
  }
  .Project-distribution{
    padding: 0px 0 10px 0;
    color:#5cb85c;
  }
  .system-del .Project-disc span{
    margin-left:20px;
  }
  .system-del{
    width: 100%;
    display: inline-block;
    padding:0 15px 15px 15px;
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
