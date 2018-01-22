<template>
  <div class="Login">
    <div>
      <div class="container">
        <div class="form-login">
          <h2 class="form-login-heading">登录</h2>
          <div class="login-wrap">
            <input type="text" v-model="userName" class="form-control" placeholder="账号">
            <div class="tips" v-if="!userName" ><p>请填写帐号</p></div>
            <input type="password" v-model="pwd" class="form-control" placeholder="密码">
            <div class="tips"  v-if="!pwd" > <p>请填写密码</p></div>
            <div class="checkbox"></div>
            <button class="btn btn-theme btn-block" v-on:click="login"  type="submit"><i class="fa fa-lock"></i>登录</button>

          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  export default {
    name: 'login',
    data () {
      const vm = this
      document.onkeydown = function (e) {
        if(e.keyCode === 13) {
          vm.login()
        }
      }
      return {
        userName: '',
        userNameTips: '',
        pwd: '',
        pwdTips: ''
      }
    },
    methods: {
      login: function () {
        const vm = this
        // 登录验证
        function checklogin() {
          if(!vm.userName){
            return false
          }
          if(!vm.pwd){
            return false
          }
          if(vm.userName&&vm.pwd){
            return true
          }
        }
        if(checklogin()){
          vm.KNOS.API.popLoading()
          this.KNOS.API.post(this.KNOS.PORT.login, {username: this.userName, password: this.pwd}, function (data) {
            console.log(data)
            document.onkeydown = null
            vm.KNOS.API.setToken( data.msg.token )
            vm.KNOS.API.setUserId( data.msg.id)
            sessionStorage.usrInfo =  JSON.stringify( {userName: data.msg.username} )
            switch (data.msg.role_id){
              case 1:
                vm.KNOS.API.popTips({status: 0, title: '暂未设置super Admin !'})
                vm.KNOS.API.removePopLoading()
                vm.$router.push('/home/welcome')
                break
              case 2:
                vm.KNOS.API.setPermission('expert')
                vm.KNOS.API.removePopLoading()
                vm.$router.push('/home/welcome')
                break
              case 3:
                vm.KNOS.API.setPermission('admin')
                vm.KNOS.API.removePopLoading()
                vm.$router.push('/home/welcome')
                break
              case 4:
                vm.KNOS.API.setPermission('data')
                vm.KNOS.API.removePopLoading()
                vm.$router.push('/home/welcome')
                break
              case 5:
                vm.KNOS.API.setPermission('manager')
                vm.KNOS.API.removePopLoading()
                vm.$router.push('/home/welcome')
                break
              default:
                vm.KNOS.API.popTips({status: 0, title: '未知身份的权限'})
                return
            }
          })
        }
      }
    }
  }

  Vue.config.productionTip = false

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Login{
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom:0;
  height:100%;
  width: 100%;
  background: url('../../../src/assets/login-bg.jpg') no-repeat;
  background-size: cover;
  }
.Login .form-login {
  max-width: 330px;
  margin: 100px auto 0;
  background: #fff;
  border-radius: 5px;
  -webkit-border-radius: 5px;
}
.Login .form-login h2.form-login-heading {
  margin: 0;
  padding: 25px 20px;
  text-align: center;
  background: #68dff0;
  border-radius: 5px 5px 0 0;
  -webkit-border-radius: 5px 5px 0 0;
  color: #fff;
  font-size: 20px;
  text-transform: uppercase;
  font-weight: 300;
}
.Login .login-wrap {
  padding: 20px;
}
.Login .login-wrap p{
  position: relative;
  top: -17px;
  color: red;
  font-size: 12px;
}
.Login .login-wrap .tips{
position: absolute;
}
.Login .login-wrap .tips p{
  position: relative;
  top: -17px;
  color: red;
  font-size: 12px;
}
.Login .login-wrap input{
margin-bottom: 20px;
}
.Login .btn-theme {
  color: #fff;
  background-color: #68dff0;
  border-color: #48bcb4;
}
</style>
