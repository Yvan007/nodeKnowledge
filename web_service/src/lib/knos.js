import Vue from 'vue'
import $ from 'jquery'
import jQuery from 'jquery'
import '../../plugins/ztree/js/jquery.ztree.all'
import '../../plugins/ztree/css/zTreeStyle/zTreeStyle.css'
import API from './common/api'
import PORT from './port/port'
Vue.prototype.KNOS = {
  API,
  PORT
}
