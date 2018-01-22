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

    <!--填写-->
    <div class="Specifications-content">
      <ul class="content-list">
        <li v-for="v in characterMessData">{{v.message}}</li>
      </ul>
    </div>
    <div id="page"></div>

    <!--输入框-->
    <div class="input-in">
      <span>输入内容:</span>
      <input type="text" placeholder="请输入" v-model="subMsg" class="input-box"/>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <button class="btn btn-danger" v-if="this.KNOS.API.isShow(['data'])" v-on:click="submit"> 完善 </button>
      <br>
      <span v-if="!subMsg" class="sub-tips"> 完善信息不能为空 </span>
    </div>
    <div class="Specifications-finallsh">
      <button v-on:click="back" class="btn btn-primary">暂存</button>
      <!--<button class="btn btn-success" v-if="this.KNOS.API.isShow(['data'])">暂存</button>-->
      <button class="btn btn-danger" v-if="this.KNOS.API.isShow(['data'])" v-on:click="finalSub">提交</button>
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
        buinessId: this.KNOS.API.getId('business'),
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
      submit() {
        const vm = this
        if(!vm.subMsg) return
        vm.KNOS.API.popLoading()
        vm.KNOS.API.post(vm.KNOS.PORT.perfectFeatureLibrary, {
          message: vm.subMsg,
          character_id: vm.charactId
        }, function(data){
          vm.subMsg = ''
          vm.KNOS.API.post(vm.KNOS.PORT.perfectView, {charactId: vm.charactId, page: 1}, function(data){
            const msg = data.msg
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
        })
      },
      back(){
        this.$router.go(-1)
      },
      // 特征库详单提交
      finalSub(){
        const vm = this
        vm.KNOS.API.popConfirm({
          tips: '确认提交?提交后将不可修改',
          callback() {
            vm.KNOS.API.post(vm.KNOS.PORT.perfectFeatureLibrarySubmit, {character_id: vm.charactId, businessId: vm.buinessId}, function (data) {
              vm.$router.go(-1)
            })
          }
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
  margin-top:20px;
  height: 300px;
  border: 1px solid grey;
  border-radius: 5px;
  overflow-y: auto;
}
.Specifications .Specifications-xbox  .Specifications-content .content-list li{
  width: 100%;
  margin-top: 20px;
  margin-bottom:20px;
}
.Specifications .Specifications-xbox  .Specifications-finallsh{
  width: 100%;
  float: left;
  margin: 40px 0 40px 0;
  text-align: center;
}
.Specifications .input-in{
  margin-top: 20px;
}
.sub-tips{
  color: #f00;
}
</style>
