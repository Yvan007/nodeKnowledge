<template>
  <div class="system">
    <h3>体系管理</h3>
    <div class="row mt">
      <div class="col-md-12">
        <div class="content-panel">
          <div class="channel-state">
             体系状态：
            <select class="select-w150" id="selectSystem">
              <option>-请选择-</option>
              <option data-status="1" v-if="isAdmin || isExpert">未完善</option>
              <option data-status="2" v-if="isAdmin || isExpert ">已创建</option>
              <option data-status="3" v-if="isAdmin || isExpert ">已分配</option>
              <option data-status="4" v-if="isExpert || isAdmin || isManager ">已完善</option>
            </select>
            <input type="text" placeholder="请输入关键字" class="input" v-model="searchText"/>
            <button class="btn btn-success" v-on:click="searchSys">搜索</button>
          </div>
          <div class="add-channel">
            <button v-if="this.KNOS.API.isShow(['expert'])" class="btn btn-primary" v-on:click="systemModel">添加体系</button>
            <!--<button v-if="this.KNOS.API.isShow(['expert'])" class="btn btn-danger">删除体系</button>-->
          </div>
          <h4>体系列表</h4>
          <hr>
          <div class="table-box">
            <table id="table" class="table table-striped table-advance table-hover">
              <thead>
              <tr>
                <th><input type="checkbox" id="checkAll"></th>
                <th>ID</th>
                <th>体系名称</th>
                <th>体系描述</th>
                <th>创建人</th>
                <th>创建时间</th>
                <th>体系状态</th>
                <th>操作</th>
              </tr>
              </thead>
              <tbody id="inputGroup">
              <tr v-for="msg in message">
                <td><input type="checkbox"></td>
                <td>{{ msg.id }}</td>
                <td>{{ msg.type_name }}</td>
                <td>{{ msg.desc }}</td>
                <td>{{ msg.username }}</td>
                <td>{{ formatDate(msg.create_time* 1000, 'yyyy-MM-dd hh:mm')}}</td>
                <td>{{ getStatus(msg.status).msg }}</td>
                <td>
                  <router-link :to="'/home/systemdel?systemId=' + msg.id + '_'"><button class="btn btn-success btn-xs">查看</button></router-link>
                  <button  :data-id="msg.id" v-if="(isAdmin) && (msg.status >=3 ? false : true)" v-on:click="systemDistribution" class="btn btn-danger btn-xs">分配</button>
                  <router-link :to=" '/home/perfectsystem?systemId='+ msg.id +'_' " v-if="(((isExpert ? true : false) && msg.status < 2 ) || (isManager && uId == msg.to_user)) && (msg.status !== 4 ? true : false)"><button class="btn btn-danger btn-xs">完善</button></router-link>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <!--分页-->
          <div id="page"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .system{
    width: 100%;
    padding: 0 15px 15px 15px;
  }
  .system h3{
    text-align: left;
    padding: 20px 0px;
  }
  .system hr{
    border: 0;
    border-top: 1px solid #797979;
  }
  .system h4{
    text-align: left;
    padding:15px 0;
  }
  .system .channel-state{
    text-align: left;
  }
  .system .channel-state .input{
    margin-left: 20px;
  }
  .system .channel-state .btn{
    margin-left: 20px;
  }
  .system .add-channel{
    text-align: right;
    padding: 20px 0 5px 0;
  }
  .system .add-channel .btn-danger{
    margin-left: 20px;
  }

  .system input{
    vertical-align: top;
  }
  .system table td{
    vertical-align: inherit;
  }
</style>
<script>
  export default {
    data () {
      return {
        message: '',
        searchText: '',
        isAdmin: this.KNOS.API.isShow(['admin']),
        isExpert: this.KNOS.API.isShow(['expert']),
        isManager: this.KNOS.API.isShow(['manager']),
        getStatus: this.KNOS.API.getSysStatus,
        formatDate: this.KNOS.API.formatDate,
        uId: this.KNOS.API.getUserId()
      }
    },
    mounted () {
      var vm = this
      vm.KNOS.API.checkAll({elem: '#checkAll', inputGroup: '#inputGroup'})
      vm.KNOS.API.popLoading()
      this.KNOS.API.post(this.KNOS.PORT.industryList, {'page': 1}, function (data) {
        vm.message = data.msg.industryList
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
            vm.KNOS.API.post(vm.KNOS.PORT.industryList, {'page': page}, function (data) {
              vm.message = data.msg.industryList
              vm.KNOS.API.removePopLoading()
            })
          },
          callbackPop: function (data) {
            vm.KNOS.API.popTips({
              status: 0,
              title: data.tips
            })
          }
        })
        vm.KNOS.API.removePopLoading()
      })
    },
    methods: {
      // 添加体系
      systemModel: function () {
        var vm = this
        this.KNOS.API.addModel({
          add: ' 添加体系',
          name: '体系名称',
          describe: '体系描述',
          callback: function () {
            const channelName = String($('.channel-modal .input-w300').val())
            const areaDisc = String($('.modal-add-channel-describe .text-area').val())
            if(!channelName){
              vm.KNOS.API.popTips({
                status: 0,
                time: 2000,
                title: '标题不能为空!'
              })
              return
            }
            vm.KNOS.API.post(vm.KNOS.PORT.industryAdd, {'type_name': channelName, 'desc': areaDisc}, function () {
              //　判断弹出提示框　要加弹窗
              vm.KNOS.API.popTips({
                status: 1,
                title: '添加成功'
              })
              vm.KNOS.API.post(vm.KNOS.PORT.industryList, {'page': 1}, function (data) {
                vm.message = data.msg.industryList
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
                    vm.KNOS.API.post(vm.KNOS.PORT.industryList, {'page': page}, function (data) {
                      vm.message = data.msg.industryList
                      vm.KNOS.API.removePopLoading()
                    })
                  },
                  callbackPop: function (data) {
                    vm.KNOS.API.popTips({
                      status: 0,
                      title: data.tips
                    })
                  }
                })
              })
              $('#myModal').remove()
            })
          }
        })
      },
      // 搜索
      searchSys: function () {
        const vm = this
        const status = $('#selectSystem').children('option:selected').attr('data-status')
        vm.KNOS.API.popLoading()
        vm.KNOS.API.post(vm.KNOS.PORT.industryList, {'page': 1, type_name: vm.searchText, status: status}, function (data) {
          vm.message = data.msg.industryList
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
              vm.KNOS.API.post(vm.KNOS.PORT.industryList, {'page': page,  status: status, type_name: vm.searchText}, function (data) {
                vm.message = data.msg.industryList
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
      // 分配角色
      systemDistribution: function (e) {
        const vm =this
        const elem = e.target ? e.target : e.srcElement
//        console.log(vm.attr('data-id'))
        vm.KNOS.API.post(vm.KNOS.PORT.dataManager, {
          /* eslint-disable camelcase */
          manager_id: 5 // 经理是->5  专员是->4 超级管理员->1 行业专家->2  数据管理员->3
        }, function (data) {
          console.log(data.msg.managerData)
          vm.KNOS.API.distributionModel({
            dataManager: '数据经理',
            roles: data.msg.managerData,
            callback: function () {
              vm.KNOS.API.popLoading()
              var RoleRadio = $('.distribution-modal .role-series-1 li input:radio[name="role"]:checked').val()
              if(RoleRadio) {
                console.log(RoleRadio)
                vm.KNOS.API.post(vm.KNOS.PORT.distribution, {industry_id: $(elem).attr('data-id'), to_user: RoleRadio}, function (data) {
                  vm.KNOS.API.post(vm.KNOS.PORT.industryList, {'page': $('#page .active').text(), type_name: vm.searchText, status: status}, function (data) {
                    vm.message = data.msg.industryList
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
      }
    }
  }
</script>
