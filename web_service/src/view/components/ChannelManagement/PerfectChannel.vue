<template>
    <div class="perfect-channel">
        <h3>渠道详情</h3>
        <div class="Project-title">
            渠道名称: <span>{{channelTypeOne.type_name}}</span>
        </div>
        <div class="Project-disc">
            渠道描述: <span>{{channelTypeOne.desc}}</span>
        </div>
        <div class="col-md-12">
            <div class="zTree-box">
                <ul id="ChannelzTree" class="ztree"></ul>
            </div>
            <div class="tree-btn">
                <router-link to="/home/channel"><button class="btn btn-primary">返回</button></router-link>
                <!--<button class="btn btn-success">暂存</button>-->
                <!--<button class="btn btn-danger">提交</button>-->
            </div>
        </div>
    </div>
</template>
<style scoped>
    .perfect-channel{
        width: 100%;
        padding: 0 15px 15px 15px;
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
            dblClickExpand: false
          }
        },
        zNodes:[],
        channelTypeOne: ''
      }
    },
    mounted () {
      const vm = this
      vm.KNOS.API.popLoading()
      const channelId = this.KNOS.API.getId('channel')
      /* eslint-disable camelcase */
      vm.KNOS.API.post(vm.KNOS.PORT.channelView, {channel_id: channelId}, function (data) {
        vm.channelTypeOne = data.msg.channelTypeOne
//        console.log(vm.)
        vm.zNodes = vm.KNOS.API.loadNodes(data.msg.arrRes, 0)
        $.fn.zTree.init($('#ChannelzTree'), vm.setting, vm.zNodes)
        vm.KNOS.API.removePopLoading()
      })

    }
  }
</script>
