<template>
  <div class="ProjectDetails">
    <div class="ProjectDetails_left">
      <h3>项目详情</h3>
      <h4>项目</h4>
      <div class="Project-title">
        项目名称: <span>{{projectData.pro_name}}</span>
      </div>
      <div class="Project-disc">
        项目描述: <span>{{projectData.desc}}</span>
      </div>
      <!--选项卡开始-->
      <h4>体系</h4>
      <div class="Details-xbox">
        <div class="Details-choise">
          <span>选择体系:</span>
          <select class="select-w150" id="sel">
            <option value="">请选择</option>
            <option v-for="key in systemList" :data-id="key.id">
              {{key.type_name}}
            </option>
          </select>
        </div>
        <!--选项卡结束-->
        <div class="Details-thirdbox">
          <!--树-->
          <div class="Details-tree">
            <ul id="tree" class="ztree"></ul>
          </div>

        </div>
      </div>
    </div>

      <!--右边-->
      <div class="Details-content">
        <div class="Details-content-h3">
          <h3 v-if="businessData.length">模式类型列表</h3>
          <button class="btn btn-danger" v-if="isAdmin&&projectStatus === 4" v-on:click="allSubmit">结束选择特征库</button>
          <button class="btn btn-success" v-if="isAdmin&&projectStatus > 4">选择特征库已结束</button>
        </div>

        <div class="Details-list">
          <div class="Details-listname" v-for="v1 in businessData">
            <span class="btn btn-default" v-for="v2 in  JSON.parse(v1.industry_info)">{{v2.industry_name}}</span>
            <span class="btn btn-default">{{v1.weight}}</span>
            <button class="btn btn-success col-3" v-if="isAdmin && projectStatus === 2" v-on:click="distributionModel" :data-status="v1.status" :bussesId="v1.id"> 分配</button>
            <router-link v-if="isManager && v1.status===2 && projectStatus !== 5 && v1.to_user == uId" :to="'/home/lect?businessId='+ v1.id + '_&projectId=' + projectId +'_&usrId='+v1.to_user+'_&businesStatus='+ v1.status +'_'"><button class="btn btn-danger"> 选择特征库</button></router-link>
            <!--<div>{{ '模式类型状态: '+v1.status  + ';   ' +   '项目状态: ' +  projectStatus}}</div>-->
            <router-link v-if="projectStatus >= 3" :to="'/home/brary?businessId='+ v1.id + '_&projectId=' + projectId +'_'"><button class="btn btn-primary">查看</button></router-link>
            <p class="chose" v-if=" (projectStatus >= 3 || isAdmin) && v1.status !== 1">{{'分配人: '+ v1.username +'&nbsp;&nbsp;&nbsp;&nbsp;时间: ' + formatDate(v1.distribution_time* 1000, 'yyyy-MM-dd hh:mm')}}</p>
          </div>
        </div>
      </div>

      <div class="Details-finallsh">
        <router-link to="/home/project"><button class="btn btn-primary">返回</button></router-link>
        <router-link to="/home/project" v-if="isAdmin&&projectStatus===2"><button class="btn btn-primary">暂存</button></router-link>
        <!--<button v-if="this.KNOS.API.isShow(['admin'])" class="btn btn-success">暂存</button>-->
        <button v-if="isAdmin&&projectStatus===2" class="btn btn-danger" v-on:click="submit">提交</button>

      </div>

    </div>
</template>

<script>
  export default {
    data () {
      return {
        setting: {
          view: {
            dblClickExpand: false
          }
        },
        zNodes: [],
        // 项目ID
        projectId: this.KNOS.API.getId('project'),
        isAdmin: this.KNOS.API.isShow(['admin']),
        isManager: this.KNOS.API.isShow(['manager']),
        projectData: '',
        systemList: '',
        getStatus: this.KNOS.API.getProjectStatus,
        businessData: [],
        projectStatus: '',
        formatDate: this.KNOS.API.formatDate,
        uId: this.KNOS.API.getUserId()

      }
    },
    mounted () {
      var vm = this
      this.KNOS.API.popLoading()
      this.KNOS.API.post(this.KNOS.PORT.projectViewProject, {'project_id': vm.projectId}, function (data) {
        console.log(data)
        // 项目信息
        vm.projectData = data.msg.projectData
        vm.projectStatus = data.msg.projectData.status
        // 体系select
        vm.systemList = data.msg.industryTypeData

        // 模式类型列表
        if (vm.projectStatus >=2) {
          vm.businessData = data.msg.businessData
        }
        vm.KNOS.API.removePopLoading()
      })
      // 获得select的体系列表
      $('#sel')[0].onchange = function (e) {
        const id = $(this).children('option:selected').attr('data-id')
        if(!id){
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
    methods:{
      // 分配项目模式列表角色
      distributionModel (e) {
        const vm =this
        const elem = e.target ? e.target : e.srcElement
        vm.KNOS.API.post(vm.KNOS.PORT.dataManager, {
          /* eslint-disable camelcase */
          manager_id: 5 // 经理是->5  专员是->4 超级管理员->1 行业专家->2  数据管理员->3
        }, function (data) {
          vm.KNOS.API.distributionModel({
            dataManager: '数据经理',
            roles: data.msg.managerData,
            callback: function () {
              vm.KNOS.API.popLoading()
              var RoleRadio = $('.distribution-modal .role-series-1 li input:radio[name="role"]:checked').val()
              if(RoleRadio) {
                console.log( RoleRadio, $(elem).attr('bussesId'))
                vm.KNOS.API.post(vm.KNOS.PORT.distributionFeatures, {business_id: $(elem).attr('bussesId'), to_user: RoleRadio}, function (data) {
                  vm.KNOS.API.post(vm.KNOS.PORT.projectViewProject, {'project_id': vm.projectId}, function (data) {
                    console.log(data)
                    // 项目信息
                    vm.projectData = data.msg.projectData
                    // 体系select
                    vm.systemList = data.msg.industryTypeData
                    // 模式类型列表
                    vm.businessData = data.msg.businessData
                    vm.KNOS.API.removePopLoading()
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
      // 提交业务模式
      submit () {
        const vm = this
        vm.KNOS.API.popConfirm({
          tips: '确认提交?提交后将不可修改',
          callback () {
            vm.KNOS.API.popLoading()
            vm.KNOS.API.post(vm.KNOS.PORT.businessSubmit, {projectId: vm.projectId}, function () {
              vm.KNOS.API.removePopLoading()
              vm.$router.push('/home/project')
            })
          }
        })
      },
      allSubmit () {
        const vm =this
        vm.KNOS.API.popConfirm({
          tips: '确认提交?提交后将不可修改',
          callback() {
            vm.KNOS.API.popLoading()
            vm.KNOS.API.post(vm.KNOS.PORT.businessSubmission, {projectId: vm.projectId}, function () {
              vm.KNOS.API.removePopLoading()
              location.reload()
            })
          }
        })

      }
    }
  }
</script>

<style scoped>
  h3{
    margin: 0;padding: 0;
  }
.ProjectDetails{
    width: 100%;
    padding: 20px;
    text-align: left;
    overflow: hidden;
  }
  .ProjectDetails .ProjectDetails_left{
    width: 40%;
    float: left;
  }
  .ProjectDetails .ProjectDetails_left h4{
    margin-top: 20px;
  }
  .ProjectDetails>h3{
    padding: 20px 0;
  }
  .ProjectDetails .Project-title{
    padding: 15px 0 5px 0;
  }
.ProjectDetails .Project-title span{
  margin-left:20px;
}
.ProjectDetails .Project-disc{
  padding: 5px 0 15px 0;
}
.ProjectDetails .Project-disc span{
  margin-left:20px;
}
.ProjectDetails .Details-xbox{
  width: 100%;
  padding:10px 0 0 0;
}
.ProjectDetails .Details-xbox .Details-choise{
  width: 100%;
  text-align: left;
  margin-right: 20px;
}
.ProjectDetails .Details-xbox  .Details-thirdbox{
  width: 100%;
  margin-top: 20px;
}
.ProjectDetails .Details-xbox  .Details-thirdbox .Details-tree{
  min-width: 400px;
  float: left;
  margin-right:20px;
}
.ProjectDetails .Details-content{
  width: 60%;
  height: 400px;
  float: left;
}
.ProjectDetails .Details-content .Details-content-h3{
    width: 100%;
  }
.ProjectDetails .Details-content .Details-content-h3 .btn{
  float: left;
  margin-left: 50px;
  }
.ProjectDetails .Details-content h3{
  float: left;
  line-height: 35px;
}
.ProjectDetails  .Details-list{
  width: 100%;
  height: 300px;
  margin-top: 20px;
  overflow-y: auto;
}
.ProjectDetails  .Details-content  .Details-list  .Details-listname{
  width: 100%;
  margin-top: 20px;
  margin-bottom:20px;
}
.ProjectDetails .Details-finallsh{
  width: 100%;
  float: left;
  margin:0 0 20px 0;
  text-align: center;
}
.chose{
  color: #5cb85c;
}
</style>
