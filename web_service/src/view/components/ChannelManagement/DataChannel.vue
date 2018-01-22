<template>
  <div class="data-channel">
    <h3>渠道管理</h3>
    <div class="row mt">
      <div class="col-md-12">
        <div class="content-panel">
          <div class="channel-state">
            渠道状态：
            <select class="select-w150" id="selectChannel">
              <option>-请选择-</option>
              <option data-status="1">未完善</option>
              <option data-status="2">已完善</option>
              <!--<option data-status="3">3</option>-->
            </select>
            <input type="text" placeholder="请输入关键字" class="input" v-model="channelText"/>
            <button class="btn btn-success" v-on:click="searchChannel">搜索</button>
          </div>
          <div class="add-channel">
            <button class="btn btn-primary" v-on:click="channelModel">添加渠道</button>
            <!--<button class="btn btn-danger">删除渠道</button>-->
          </div>
          <h4>渠道列表</h4>
          <hr>
          <div class="table-box">
            <table id="table" class="table table-striped table-advance table-hover">
              <thead>
              <tr>
                <th><input type="checkbox" id="checkAll"></th>
                <th>ID</th>
                <th>渠道名称</th>
                <th>渠道描述</th>
                <th>创建人</th>
                <th>创建时间</th>
                <th>渠道状态</th>
                <th>操作</th>
              </tr>
              </thead>
              <tbody id="inputGroup">
              <tr v-for="msg in message">
                <td><input type="checkbox"></td>
                <td>{{ msg.id }}</td>
                <td>{{ msg.type_name}}</td>
                <td>{{ msg.desc }}</td>
                <td>{{ msg.username }}</td>
                <td>{{ formatDate(msg.create_time* 1000, 'yyyy-MM-dd hh:mm')}}</td>
                <td>{{ msg.status }}</td>
                <td>
                  <router-link :to="'/home/perfectchannel?channelId=' + msg.id + '_'"><button class="btn btn-success btn-xs">查看</button></router-link>
                  <router-link :to="'/home/viewchannel?channelId=' + msg.id + '_'" v-if="(isAdmin | isManager ? true : false) && (msg.status === 1 ? true : false)"><button class="btn btn-danger btn-xs">完善</button></router-link>
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
<script>
    export default {
      data () {
        return {
          message: '',
          channelText: '',
          isAdmin: this.KNOS.API.isShow(['admin']),
          isManager: this.KNOS.API.isShow(['manager']),
          formatDate: this.KNOS.API.formatDate
        }
      },
      mounted () {
        var vm = this
        vm.KNOS.API.checkAll({elem: '#checkAll', inputGroup: '#inputGroup'})
        vm.KNOS.API.popLoading()
        this.KNOS.API.post(this.KNOS.PORT.channelList, {'page': 1}, function (data) {
          vm.message = data.msg.channelList
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
              vm.KNOS.API.post(vm.KNOS.PORT.channelList, {'page': page}, function (data) {
                vm.message = data.msg.channelList
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
        channelModel: function () {
          var vm = this
          this.KNOS.API.addModel({
            add: '添加渠道:',
            name: '渠道名称:',
            describe: '渠道描述:',
            callback: function () {
              // ajax
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
              vm.KNOS.API.post(vm.KNOS.PORT.channelAdd, {'type_name': channelName, 'desc': areaDisc}, function () {
                vm.KNOS.API.popTips({
                  status: 1,
                  title: '添加成功'
                })
                vm.KNOS.API.popLoading()
                vm.KNOS.API.post(vm.KNOS.PORT.channelList, {'page': 1}, function (data) {
                  vm.message = data.msg.channelList
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
                      vm.KNOS.API.post(vm.KNOS.PORT.channelList, {'page': page}, function (data) {
                        vm.message = data.msg.channelList
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
                $('#myModal').remove()
              })
            }
          })
        },
        searchChannel: function () {
          const vm = this
          const status = $('#selectChannel').children('option:selected').attr('data-status')
          vm.KNOS.API.popLoading()
          vm.KNOS.API.post(vm.KNOS.PORT.channelList, {'page': 1, type_name: vm.channelText, status: status}, function (data) {
            vm.message = data.msg.channelList
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
                vm.KNOS.API.post(vm.KNOS.PORT.channelList, {'page': page,  status: status, type_name: vm.channelText}, function (data) {
                  vm.message = data.msg.channelList
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
        }
      }
    }
</script>
