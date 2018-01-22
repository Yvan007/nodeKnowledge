<template>
  <div>
    <h1>查看实例</h1>
    <div>
      <p v-for="v in msg" class="case-list">
        <button class="btn btn-default margin-left-10" v-for="v2 in v.case_infos">{{v2.channel_name + '+' + v2.industry_name}}</button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button class="btn btn-danger">{{v.fenzhi}}</button>
      </p>
      <div class="loadConfModal">
        <button class="btn btn-success" v-on:click="loadConf" data-toggle="modal" data-target="#myModal">导出实例文件</button>
        <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div class="modal-body">
                <a :data-path="v" v-for="v in loadMsg" v-on:click="loadOneConf">{{v}}</a>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
              </div>
            </div><!-- /.modal-content -->
          </div><!-- /.modal -->
        </div>
      </div>
      <div id="page"></div>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        projectId: this.KNOS.API.getId('project'),
        msg: [],
        loadMsg: ''
      }
    },
    mounted (){
      const vm = this
      vm.KNOS.API.popLoading()
      vm.KNOS.API.post(vm.KNOS.PORT.selectCase, {project_id: vm.projectId, page: 1}, function (data) {

        vm.msg = data.msg.characterCaseData
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
            vm.KNOS.API.post(vm.KNOS.PORT.selectCase, {project_id: vm.projectId, page: page}, function (data) {
              vm.msg = data.msg.characterCaseData
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
      loadConf () {
        const vm = this
        vm.KNOS.API.popLoading()
        vm.KNOS.API.post(vm.KNOS.PORT.datamanagerExportYaml, {project_id: vm.projectId}, function (data) {
          console.log(data)
          vm.loadMsg = data.msg
          vm.KNOS.API.removePopLoading()
        })
      },
      loadOneConf (e) {
        const elem = e.target ? e.target : e.srcElement
        const vm = this
        const data = {yamlPath: $(elem).attr('data-path')}
        const arrFileName = $(elem).attr('data-path').match( /\/yaml\/.+\/(.+?\.yaml)/ )
        var fileName = 'test'
        if(arrFileName.length === 2){
          fileName = arrFileName[1]
        }
        var url = vm.KNOS.PORT.datamanagerExportYamlFile

        var xhr = new XMLHttpRequest()

        // 也可以使用POST方式，根据接口
        xhr.open('POST', url, true)

        xhr.setRequestHeader('Authorization', 'Bearer ' + vm.KNOS.API.getToken() )
        // 返回类型blob
        xhr.responseType = 'blob'

        // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑

        xhr.onload = function () {

          // 请求完成

          if (this.status === 200) {


            // 返回200

            var blob = this.response

            var reader = new FileReader()

            // 转换为base64，可以直接放入a表情href
            reader.readAsDataURL(blob)

            reader.onload = function (e) {

              console.log(e)

              // 转换完成，创建一个a标签用于下载

              var a = document.createElement('a')

              a.download = fileName + '.yaml'

              a.href = e.target.result

              // 修复firefox中无法触发click

              $('body').append(a)

              a.click()

              $(a).remove()

            }

          }

        }

        // 发送ajax请求
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify( data ))
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
    padding: 15px 0 20px 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  .case-list{
    margin: 15px 0 20px 0;
    padding-left: 20px;
    text-align: left;
  }
  .margin-left-10{
    margin-left: 10px;
  }
  .modal-dialog{
    position: absolute;
    left: 50%;
    top: 22%;
    margin-left: -300px;
  }
  .modal-body {
    padding: 20px 0;
  }
  .modal-dialog .modal-body a{
    display: block;
    padding: 4px;
    cursor: pointer;
  }
</style>
