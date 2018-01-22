<template>
<div class="FeatureLlibrary">
  <h3>特征库列表</h3>
  <div class="Llibrary-xbox">
    <!--选中的-->
    <div class="Llibrary-chose">
      <span class="btn btn-default" v-for="v in JSON.parse( businessData.industry_info )">{{v.industry_name}}</span>
      <span class="btn btn-default">{{businessData.weight}}</span>
    </div>
    <h4>特征库列表</h4>
    <div class="Llibrary-listbox">
      <div class="Llibrary-listname" v-for="v in characterData">
        <span class="btn btn-default">{{v.industry_sysname}}</span>
        <span class="btn btn-default">{{v.channel_sysname}}</span>
        <span class="btn btn-default">{{v.weight}}</span>
        <button class="btn btn-success col-3" v-if="isAdmin &&v.status !=3&& projectStatus <=5" v-on:click="distributionLibrary" :charact-id="v.id"> 分配</button>
        <!--<div>{{ '特征库状态: '+v.status  + ';   ' +   '项目状态: ' +  projectStatus}}</div>-->
        <router-link :to="'/home/tion?businessId=' + businessId + '_&charactId=' + v.id + '_'" v-if="uId == v.to_user && isdata && v.status===2 && projectStatus !=8"><button class="btn btn-danger"> 完善特征库</button></router-link>
        <router-link :to="'/home/checklibrary?businessId=' + v.id + '_&charactId=' + v.id + '_'"><button class="btn btn-primary">查看</button></router-link>
        <p class="chose" v-if="v.status !== 1">{{'分配人: '+ v.username +'&nbsp;&nbsp;&nbsp;&nbsp;时间: ' + formatDate(v.distribution_time* 1000, 'yyyy-MM-dd hh:mm')}}</p>
      </div>
    </div>
    <div class="Llibrary-finallsh">
      <button v-on:click="back" class="btn btn-primary" v-if="isAdmin && projectStatus ===5">暂存</button>
      <!--<button v-if="this.KNOS.API.isShow(['admin'])" class="btn btn-success">暂存</button>-->
      <button class="btn btn-success" v-on:click="back">返回</button>
      <button class="btn btn-danger" v-if="isAdmin && ( projectStatus === 5 || projectStatus === 4 ) && submitShow" v-on:click="librarySubmit">提交</button>
      <!--<div>{{projectStatus}}</div>-->
      <button class="btn btn-danger" v-if="isAdmin && projectStatus === 7" v-on:click="perfectFeatureLibraryTotalSubmit">项目完成</button>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    name: 'feature-library',
    data () {
      return {
        isAdmin: this.KNOS.API.isShow(['admin']),
        isdata: this.KNOS.API.isShow(['data']),
        businessId: this.KNOS.API.getId('business'),
        isShow: this.KNOS.API.isShow,
        businessData: {
          industry_info: '{}'
        },
        characterData: {},
        formatDate: this.KNOS.API.formatDate,
        projectId:this.KNOS.API.getId('project'),
        projectStatus: '',
        uId: this.KNOS.API.getUserId(),
        submitShow: false
      }
    },
    mounted () {
      const vm = this
      vm.KNOS.API.popLoading()
      vm.KNOS.API.post(vm.KNOS.PORT.selectFeatureLibrary, {business_id: vm.businessId, projectId: vm.projectId}, function (data) {
        const msg = data.msg
        vm.businessData = msg.businessData
        vm.characterData = msg.characterData
        vm.projectStatus = msg.projectStatus.status

        vm.submitShow = vm.characterData.length === 0 ? false : true

        vm.KNOS.API.removePopLoading()
      })
    },
    methods: {
      distributionLibrary (e) {
        const vm = this
        const elem = e.target ? e.target : e.srcElement
        // 得到分配人的信息
        vm.KNOS.API.post(vm.KNOS.PORT.dataManager, {manager_id: 4}, function (data) {
          vm.KNOS.API.distributionModel({
            dataManager: '数据专员',
            roles: data.msg.managerData,
            callback: function () {
              vm.KNOS.API.popLoading()
              var RoleRadio = $('.distribution-modal .role-series-1 li input:radio[name="role"]:checked').val()
              if(RoleRadio) {
                console.log( RoleRadio, $(elem).attr('charact-id'))
                vm.KNOS.API.post(vm.KNOS.PORT.distributionCharacter, {charact_id: $(elem).attr('charact-id'), to_user: RoleRadio}, function (data) {
                  vm.KNOS.API.post(vm.KNOS.PORT.selectFeatureLibrary, {business_id: vm.businessId, projectId: vm.projectId}, function (data) {
                    const msg = data.msg
                    vm.businessData = msg.businessData
                    vm.characterData = msg.characterData
                  })
                  vm.KNOS.API.removePopLoading()
                  $('#myModal').remove()
                })
              }else {
                vm.KNOS.API.popTips({
                  status: 0,
                  time: 2000,
                  title: '请选择角色'
                })
              }
            }
          })
        })
      },
      back(){
        this.$router.go(-1)
      },
      // 特征库提交
      librarySubmit () {
        const vm = this
        vm.KNOS.API.popConfirm({
          tips: '确认提交?提交后将不可修改',
          callback() {
            vm.KNOS.API.popLoading()
            vm.KNOS.API.post(vm.KNOS.PORT.characterSubmit, {projectId: vm.projectId}, function (data) {
              console.log(data.msg)
              vm.KNOS.API.removePopLoading()
              // vm.$router.push('/home/details?projectId='+vm.projectId+'_')
              location.reload()
            })
          }
        })
      },
      // 特征库总提交
      perfectFeatureLibraryTotalSubmit () {
        const vm = this
        vm.KNOS.API.popConfirm({
          tips: '确认提交?提交后将不可修改',
          callback() {
            vm.KNOS.API.popLoading()
            vm.KNOS.API.post(vm.KNOS.PORT.perfectFeatureLibraryTotalSubmit, {projectId: vm.projectId}, function (data) {
              console.log(data.msg)
              vm.KNOS.API.removePopLoading()
              // vm.$router.push('/home/details?projectId='+vm.projectId+'_')
              location.reload()
            })
          }
        })
      },
      back () {
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped>
.FeatureLlibrary{
  width: 100%;
  padding: 0 20px;
  text-align: left;
}
.FeatureLlibrary h3, h4{
  padding: 20px 0;
}
.FeatureLlibrary .Llibrary-xbox{
  width: 100%;
  overflow: hidden;
}
.FeatureLlibrary .Llibrary-xbox .Llibrary-chose{
  width: 100%;
  /*padding-top: 20px;*/
  /*margin-bottom: 40px;*/
}
.FeatureLlibrary .Llibrary-xbox .Llibrary-listbox{
  width: 100%;
}
.FeatureLlibrary .Llibrary-xbox .Llibrary-listbox  .Llibrary-listname{
  width: 100%;
  margin-bottom: 20px;
}
.FeatureLlibrary .Llibrary-xbox  .Llibrary-finallsh{
  width: 100%;
  float: left;
  margin: 40px 0 180px 0;
  text-align: center;
}
.chose{
  color: #5cb85c;
}
</style>
