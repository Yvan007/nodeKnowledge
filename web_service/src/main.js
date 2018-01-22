// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Router from 'vue-router'
import './lib/knos'
import router from './router'
import Vuex from 'vuex'
import {check404} from './router/index'
import 'bootstrap'
import 'jquery.backstretch/src/jquery.backstretch'
// import 'gritter/css/jquery.gritter.css'
import 'font-awesome/css/font-awesome.css'
import 'bootstrap/dist/css/bootstrap.min.css'

Vue.use(Router)
Vue.config.productionTip = false

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  permission: false
})

/* eslint-disable no-new */
const vm = new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})

// 白名单
const whiteList = ['/', '/lost']
router.beforeEach(function(to, from, next) {
  if(whiteList.indexOf(to.path) !== -1) {
    next()
    return
  }
  const userInfo = vm.KNOS.API.getUserInfo('_per')
  if(userInfo !== undefined) {
    check404(to)
      ? next('/lost')
      : vm.KNOS.API.checkPermission(userInfo, to, from, next)
  }else{
    // alert(userInfo)
    next('/')
  }
})
// console.log(vm.KNOS.API.permissionRoutes)
