<template>
  <div class="Specifications">
    <h3>特征库详单</h3>
    <div class="Specifications-xbox">
      <!--选中的-->
      <div class="Specifications-chose">
        <span class="btn btn-default" >{{industryName}}</span>+
        <span class="btn btn-default">{{channelName}}</span>=
        <span class="btn btn-default">{{weight}}</span>
      </div>

      <div class="Specifications-content">
        <ul class="content-list">
          <li v-for="v in characterMessData">{{v.message}}</li>
        </ul>
      </div>
      <div id="page"></div>

      <div class="Specifications-finallsh">
        <button v-on:click="back" class="btn btn-primary">返回</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'specifications',
    data () {
      return {
        charactId: this.KNOS.API.getId('charact'),
        weight:'',
        characterMessData:[],
        industryName: '',
        channelName: '',
        subMsg:''
      }
    },

    mounted (){
      const vm = this
      vm.KNOS.API.popLoading()
      vm.KNOS.API.post(vm.KNOS.PORT.perfectView, {charactId: vm.charactId, page: 1}, function(data){
        const msg = data.msg
        vm.weight = msg.characterData.weight
        vm.industryName = msg.characterData.industry_name
        vm.channelName = msg.characterData.channel_name
        vm.characterMessData = msg.characterMessData
        vm.KNOS.API.pager({
          elem: 'page',
          showNum: 5,  // 显示几个页码 , 请传　奇数
          isFirst: true,  // 回到首页
          isLast: true,   // 最后一页
          isNext: true,   // 下一页
          isPre: true,    // 上一页
          totalPage: Math.ceil(data.msg.count / 10),  // 总页数
          isRanderTo: false, //　跳转到
          activeClass: 'active',
          callback: function (page) {
            vm.KNOS.API.popLoading()
            vm.KNOS.API.post(vm.KNOS.PORT.perfectView, {charactId: vm.charactId, page: page}, function (data) {
              const msg = data.msg
              vm.characterMessData = msg.characterMessData
              vm.KNOS.API.removePopLoading()
            })
          },
          callbackPop: function (data) {
            vm.KNOS.API.popTips({
              status: 0,
              time: 2000,
              title: data.tips
            })
          }
        })
        vm.KNOS.API.removePopLoading()
      })
    },
    methods: {
      back(){
        this.$router.go(-1)
      },
      finalSub(){
        const vm = this



        vm.KNOS.API.post(vm.KNOS.PORT.perfectFeatureLibrarySubmit, {character_id: vm.charactId}, function (data) {
          vm.$router.go(-1)
        })
      }
    }

  }

</script>

<style scoped>
  .Specifications{
    width: 100%;
    padding: 0 20px;
    text-align: left;
  }
  .Specifications h3{
    padding: 20px 0;
  }
  /*.Specifications .Specifications-xbox{*/
  /*width: 100%;*/
  /*}*/
  /*.Specifications .Specifications-xbox  .Specifications-chose{*/
  /*width: 100%;*/
  /*}*/
  .Specifications .Specifications-xbox  .Specifications-content{
    height: 400px;
    background: lightblue;
  }
  .Specifications .Specifications-xbox  .Specifications-content .content-list li{
    width: 100%;
    margin-top: 20px;
  }
  .Specifications .Specifications-xbox  .Specifications-finallsh{
    width: 100%;
    float: left;
    margin: 40px 0 180px 0;
    text-align: center;
  }
  .Specifications .input-in{
    margin-top: 20px;
  }
  .sub-tips{
    color: #f00;
  }
</style>
