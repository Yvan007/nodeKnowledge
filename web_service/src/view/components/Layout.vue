<template>
  <div class="layout">
    <div class="navbar logo" role="navigation">
      <div class="container-fluid">
        <div class="navbar-header">
          <!--左导航展开合并-->
          <div class="sidebar-toggle-box menu">
            <div class="fa fa-bars tooltips" data-placement="right" data-original-title="切换导航"></div>
          </div>
          <a class="navbar-brand logo_name" href="#"><b class="logo_font">保时捷</b></a>
          <div class="login-btn-box">
            <span class="who">欢迎您,&nbsp;&nbsp;{{userName}}</span>
            <button class="btn btn-success" v-on:click="loginOut">退出</button>
          </div>
        </div>
      </div>
    </div>
    <div id="sidebar"  class="nav-collapse">
      <!--<div  v-on:click="toggle" class="collapse-box">-->
        <!--<span class="glyphicon glyphicon-tags"></span><router-link to="/home/welcome" class = "data">数据管理员任务</router-link>-->
      <!--</div>-->
      <!--<ul class="data-child" v-show="isShow">-->
        <!--<li><router-link to="/home/project?status=1"><span class="glyphicon glyphicon-bell" ></span> 体系完善任务 </router-link></li>-->
        <!--<li><router-link to="/home/project?status=2"><span class="glyphicon glyphicon-send" ></span> 选择特征库任务 </router-link></li>-->
        <!--<li><router-link to="/home/project?status=3"><span class="glyphicon glyphicon-heart" ></span> 特征库完善任务 </router-link></li>-->
      <!--</ul>-->
        <ul v-on:click="navClick" class="nav nav-list bs-docs-sidenav affix nav-style" id="navigation">
          <!--<li v-if="this.KNOS.API.isShow(['admin'])"><router-link to="/home/project?status=1"><span class="glyphicon glyphicon-folder-close" ></span> 体系完善任务 </router-link></li>-->
          <!--<li v-if="this.KNOS.API.isShow(['admin'])"><router-link to="/home/project?status=2"><span class="glyphicon glyphicon-folder-close" ></span> 选择特征库任务 </router-link></li>-->
          <!--<li v-if="this.KNOS.API.isShow(['admin'])"><router-link to="/home/project?status=3"><span class="glyphicon glyphicon-folder-close" ></span> 特征库完善任务 </router-link></li>-->
          <li :class="meta === 'project' ? ' active-nav ' : ''"><router-link to="/home/project"><span class="glyphicon glyphicon-folder-close" ></span> 项目管理</router-link></li>
          <li :class="meta === 'system' ? ' active-nav ' : ''"><router-link to="/home/system" v-if="this.KNOS.API.isShow(['expert', 'manager', 'admin'])"><span class="glyphicon glyphicon-book"></span> 体系管理</router-link></li>
          <li :class="meta === 'channel' ? ' active-nav ' : ''"><router-link to="/home/channel" v-if="this.KNOS.API.isShow(['manager'])"><span class="glyphicon glyphicon-stats"></span> 数据渠道</router-link></li>
        </ul>
    </div>
    <div class="layout-content" >
      <router-view></router-view>
    </div>

  </div>
</template>
<style scoped>
  .collapse-box{
    color: white;
  }
  .collapse-box span{
    display: inline-block;
    margin-right: 10px;
  }

  a:hover{
    text-decoration: none;
  }
  a:visited{
    text-decoration: none;
  }
  a:active{
    text-decoration: none;
  }
  .layout .active-nav{
    background-color: #263c66;
  }
  /*.nav-style{*/
    /*height: 0;*/
    /*overflow: hidden;*/
  /*}*/
  .who{
    float: left;
    color: white;
  }
  .data{
    width: 100%;
    height: 60px;
    color: white;
    line-height: 60px;
  }
  .data-child{
    width: 100%;
    color: white;
  }
  .data-child li{
    width: 100%;
   height: 50px;
    line-height: 60px;
    color: white;
    background-color: #263c66;
  }
  .data-child li a{
    color: white;
  }
</style>
<script>

export default {
  data(){
    return {
      meta: this.$router.history.current.meta,
      userName:JSON.parse( sessionStorage.usrInfo ).userName,
      isShow: false
    }
  },
  methods: {
    navClick(e) {
      const elem = e.target ? e.target : e.srcElement
      if (elem.nodeName === 'A') {
        console.log(elem)
        $('#sidebar').find('li').removeClass('active-nav')
        $('#sidebar').find($(elem).parent()).addClass('active-nav')
      }
    },
    loginOut() {
      const vm = this
      vm.KNOS.API.popLoading()
      vm.KNOS.API.post(vm.KNOS.PORT.loginOut, {}, function (data) {
        console.log(data)
        vm.KNOS.API.removePopLoading()
        vm.$router.push('/')
      })
    },
    toggle() {
      this.isShow = !this.isShow
    }
  }
}
</script>
