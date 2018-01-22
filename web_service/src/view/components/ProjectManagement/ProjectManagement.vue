<template>
  <div class="data-channel">
    <h3>项目管理</h3>
    <div class="row mt">
      <div class="col-md-12">
        <div class="content-panel">
          <div class="channel-state">
            项目状态：
            <select class="select-w150" id="selectProject">
              <option>-请选择-</option>
              <option data-status="1" v-if="isExpert || isAdmin">项目已创建</option>
              <option data-status="2" v-if="isExpert || isAdmin">业务模式已创建</option>
              <option data-status="3" v-if="isExpert || isAdmin || isM">业务模式分配完成</option>
              <option data-status="4" v-if="isExpert || isAdmin || isM">选择特征库已有完成项</option>
              <option data-status="5" v-if="isExpert || isAdmin || isM">选择特征库已结束</option>
              <option data-status="6">选择特征库分配已完成</option>
              <option data-status="7">特征库详单已有提交</option>
              <option data-status="8">项目已结束</option>
            </select>
            <input type="text" placeholder="请输入关键字" class="input" v-model="searchText"/>
            <button class="btn btn-success" v-on:click="searchPro">搜索</button>
          </div>
          <div class="add-channel">
            <button v-if="isExpert" class="btn btn-primary" v-on:click="projectModel">添加项目</button>
            <button v-if="isExpert" class="btn btn-danger" v-on:click="projectDele">删除项目</button>
          </div>
          <h4>项目列表</h4>
          <hr>
          <div class="table-box">
            <table id="table" class="table table-striped table-advance table-hover">
              <thead>
              <tr>
                <th><input type="checkbox" id="checkAll"></th>
                <th>ID</th>
                <th>项目名称</th>
                <th>项目描述</th>
                <th>创建人</th>
                <th>创建时间</th>
                <th>项目状态</th>
                <th>操作</th>
              </tr>
              </thead>
              <tbody id="inputGroup">
              <tr v-for="msg in message">
                <td><input type="checkbox" :data-id="msg.id"></td>
                <td>{{msg.id}}</td>
                <td>{{msg.pro_name}}</td>
                <td>{{msg.desc}}</td>
                <td>{{msg.username}}</td>
                <td>{{formatDate(msg.create_time* 1000, 'yyyy-MM-dd hh:mm')}}</td>
                <td>{{getProjectStatus(msg.status).msg}}</td>
                <td>
                  <router-link :to="'/home/details?projectId=' + msg.id + '_' "><button class="btn btn-success btn-xs" >查看</button></router-link>
                  <router-link v-if="isExpert && getProjectStatus(msg.status).isShow" :to="'/home/model?projectId=' +msg.id+ '_'"><button class="btn btn-danger btn-xs">创建业务模式</button></router-link>
                  <button v-if="isAdmin" class="btn btn-danger btn-xs" v-on:click="createCase" :project-id="msg.id">生成实例</button>
                  <router-link :to="'/home/selectCase?projectId=' + msg.id + '_' " v-if="isAdmin">
                    <button class="btn btn-success btn-xs" v-if="isAdmin">查看实例</button>
                  </router-link>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div id="page"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ProjectManagement',
    data () {
      return {
        message: '',
        searchText: '',
        isExpert: this.KNOS.API.isShow(['expert']),
        isAdmin: this.KNOS.API.isShow(['admin']),
        isM: this.KNOS.API.isShow(['manager']),
        getProjectStatus: this.KNOS.API.getProjectStatus,
        checkProjectId: [],
        formatDate: this.KNOS.API.formatDate
      }
    },
    mounted () {
      var vm = this
      vm.KNOS.API.checkAll({elem: '#checkAll', inputGroup: '#inputGroup'})
      this.KNOS.API.popLoading()
      this.KNOS.API.post(this.KNOS.PORT.projectList, {'page': 1}, function (data) {
        vm.message = data.msg.projectList
        // 默认加载分页
        vm.KNOS.API.pager({
          elem: 'page',
          showNum: 5,  // 显示几个页码 , 请传　奇数
          isFirst: true,  // 回到首页
          isLast: true,   // 最后一页
          isNext: true,   // 下一页
          isPre: true,    // 上一页
          totalPage: Math.ceil(data.msg.count/10),  // 总页数
          isRanderTo: false, //　跳转到
          activeClass: 'active',
          callback: function (page) {
            vm.KNOS.API.popLoading()
            vm.KNOS.API.post(vm.KNOS.PORT.projectList, {'page': page}, function (data) {
              vm.message = data.msg.projectList
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
      // 添加项目
      projectModel: function () {
        var vm = this
        this.KNOS.API.addModel({
          add: '添加项目',
          name: '项目名称:',
          describe: '项目描述:',
          callback: function(){
            // ajax
            const channelName = String($('.channel-modal .input-w300').val())
            const areaDisc = String($('.modal-add-channel-describe .text-area').val())
            if (!channelName) {
              vm.KNOS.API.popTips({
                status: 0,
                time: 3000,
                title: '标题不能为空!'
              })
              return
            }
            vm.KNOS.API.post(vm.KNOS.PORT.projectAdd, {'pro_name': channelName, 'desc': areaDisc}, function (data) {
              vm.KNOS.API.popTips({
                status: 1,
                title: '添加成功'
              })
              vm.KNOS.API.popLoading()
              vm.KNOS.API.post(vm.KNOS.PORT.projectList, {'page': 1}, function (data) {
                vm.message = data.msg.projectList
                vm.KNOS.API.pager({
                  elem: 'page',
                  showNum: 5,  // 显示几个页码 , 请传　奇数
                  isFirst: true,  // 回到首页
                  isLast: true,   // 最后一页
                  isNext: true,   // 下一页
                  isPre: true,    // 上一页
                  totalPage: Math.ceil(data.msg.count/10), // 总页数
                  isRanderTo: false, // 跳转到
                  activeClass: 'active',
                  callback: function (page) {
                    vm.KNOS.API.popLoading()
                    vm.KNOS.API.post(vm.KNOS.PORT.projectList, {'page': page}, function (data) {
                      vm.message = data.msg.projectList
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
              $('#myModal').remove()
            })
          }
        })
      },
      // 搜索项目
      searchPro: function () {
        const vm = this
        const status = $('#selectProject').children('option:selected').attr('data-status')
        vm.KNOS.API.popLoading()
        vm.KNOS.API.post(vm.KNOS.PORT.projectList, {pro_name: vm.searchText, status: status}, function (data) {
          vm.message = data.msg.projectList
          vm.KNOS.API.pager({
            elem: 'page',
            showNum: 5,  // 显示几个页码 , 请传　奇数
            isFirst: true,  // 回到首页
            isLast: true,   // 最后一页
            isNext: true,   // 下一页
            isPre: true,    // 上一页
            totalPage: Math.ceil(data.msg.count/10),  // 总页数
            isRanderTo: false, //　跳转到
            activeClass: 'active',
            callback: function (page) {
              vm.KNOS.API.popLoading()
              vm.KNOS.API.post(vm.KNOS.PORT.projectList, {'page': page,  status: status, pro_name: vm.searchText}, function (data) {
                vm.message = data.msg.projectList
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
      // 删除项目
      projectDele(){
        const vm = this
        vm.KNOS.API.popConfirm({
          tips: '确认删除',
          callback: function () {
            vm.checkProjectId = []
            const inputs = '#table tbody [type="checkbox"]'
            const len = $(inputs).length
            for(var i = 0; i < len; i++){
              if($(inputs)[i].checked === true){
                console.log('xxx')
                console.log($($(inputs)[i]).attr('data-id'))
                vm.checkProjectId.push($($(inputs)[i]).attr('data-id'))
              }
            }
            $('#table [type="checkbox"]').attr({checked : false})
            if(!vm.checkProjectId.length){
              vm.KNOS.API.popTips({
                status: 0,
                time: 2000,
                title: '请选择需要删除的项目'
              })
              return
            }
            console.log(vm.checkProjectId)
            vm.KNOS.API.popLoading()
            vm.KNOS.API.post(vm.KNOS.PORT.projectDelete, {projectId : vm.checkProjectId}, function (data) {
              vm.KNOS.API.post(vm.KNOS.PORT.projectList, {'page': 1}, function (data) {
                vm.message = data.msg.projectList
                console.log('---')
                console.log(vm.message)
                // 默认加载分页
                vm.KNOS.API.pager({
                  elem: 'page',
                  showNum: 5,  // 显示几个页码 , 请传　奇数
                  isFirst: true,  // 回到首页
                  isLast: true,   // 最后一页
                  isNext: true,   // 下一页
                  isPre: true,    // 上一页
                  totalPage: Math.ceil(data.msg.count/10),  // 总页数
                  isRanderTo: false, //　跳转到
                  activeClass: 'active',
                  callback: function (page) {
                    vm.KNOS.API.popLoading()
                    vm.KNOS.API.post(vm.KNOS.PORT.projectList, {'page': page}, function (data) {
                      vm.message = data.msg.projectList
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
          }
        })
      },
      // 生成实例
      createCase (e) {
        const vm = this
        const elem = e.target ? e.target : e.srcElement
        vm.KNOS.API.popLoading()
        vm.KNOS.API.post(vm.KNOS.PORT.createCase, {project_id: $(elem).attr('project-id')}, function (data) {
          console.log(data)
          vm.KNOS.API.removePopLoading()
          vm.KNOS.API.popTips({
            status: 1,
            time: 2000,
            title: '生成成功'
          })
        })
      }
    }
  }
</script>
<style scoped>
  .data-channel{
    width: 100%;
    padding: 0 15px 15px 15px;
  }
  .data-channel h3{
    text-align: left;
    padding: 20px 0px;
  }
  .data-channel hr{
    border: 0;
    border-top: 1px solid #797979;
  }
  .data-channel h4{
    text-align: left;
    padding:15px 0;
  }
  .data-channel .channel-state{
    text-align: left;
  }
  .data-channel .channel-state .input{
    margin-left: 20px;
  }
  .data-channel .channel-state .btn{
    margin-left: 20px;
  }
  .data-channel .add-channel{
    text-align: left;
    padding: 20px 0 5px 0;
  }
  .data-channel .add-channel .btn-danger{
    margin-left: 20px;
  }
  .data-channel input{
    vertical-align: top;
  }
  .data-channel table td{
    vertical-align: inherit;
  }
</style>


