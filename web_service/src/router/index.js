import Vue from 'vue'
import Router from 'vue-router'

// 登录页面
import Login from '@/view/components/Login'

// 首页
import index from '@/view/components/index'

import tree from '@/view/components/tree'
// 公共头部和侧边导航栏
import Layout from '@/view/components/Layout'

// 错误提示页面
import _404 from '@/view/404'

// 项目管理
// import welcome from '@/view/components/welcome/welcome'
import ProjectManagement from '@/view/components/ProjectManagement/ProjectManagement'
import ProjectDetails from '@/view/components/ProjectManagement/ProjectDetails'
import FeatureLlibrary from '@/view/components/ProjectManagement/FeatureLlibrary'
import Specifications from '@/view/components/ProjectManagement/Specifications'
import CheckLibrary from '@/view/components/ProjectManagement/CheckLibrary'
import SelectLibrary from '@/view/components/ProjectManagement/SelectLibrary'
import BusinessModel from '@/view/components/ProjectManagement/BusinessModel'


// 欢迎页面
import welcome from '@/view/components/welcome'

// 体系管理
import System from '@/view/components/SystemManagement/System'
import SystemDel from '@/view/components/SystemManagement/SystemDel'
import PerfectSystem from '@/view/components/SystemManagement/PerfectSystem'

// 渠道管理
import DataChannel from '@/view/components/ChannelManagement/DataChannel'
import PerfectChannel from '@/view/components/ChannelManagement/PerfectChannel'
import ViewChannel from '@/view/components/ChannelManagement/ViewChannel'

// 查看实例
import selectCase from '@/view/components/case/selectCase'

Vue.use(Router)

export const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
    meta: null
  },
  {
    path: '/index',
    name: 'index',
    component: index,
    meta: null
  },
  {
    path: '/tree',
    name: 'tree',
    component: tree,
    meta: null
  },
  {
    path: '/home',
    name: 'home',
    component: Layout,
    children: [
      {
        // 欢迎页面
        path: 'welcome',
        component: welcome,
        meta: null
      },
      {
        // 项目管理二级页面
        path: 'project',
        component: ProjectManagement,
        meta: 'project'
      },
      {
        // 项目详情页面
        path: 'details',
        component: ProjectDetails,
        meta: 'project'
      },
      {
        // 特征库列表
        path: 'brary',
        component: FeatureLlibrary,
        meta: 'project'
      },
      {
        // 特征库详单
        path: 'tion',
        component: Specifications,
        meta: 'project'
      },
      {
        // 选择特征库
        path: 'lect',
        component: SelectLibrary,
        meta: 'project'
      },
      {
        // 查看特征库
        path: 'checklibrary',
        component: CheckLibrary,
        meta: 'project'
      },
      {
        // 创建业务模式
        path: 'model',
        component: BusinessModel,
        meta: 'project'
      },
      // 查看实例
      {
        path: 'selectCase',
        component: selectCase,
        meta: 'project'
      },
      // {
      //   // 公共组件
      //   path: 'table',
      //   component: table
      // },
      {
        // 数据渠道添加页面
        path: 'channel',
        component: DataChannel,
        meta: 'channel'
      },
        // 数据渠道查看页面
      {
        path: 'perfectchannel',
        component: PerfectChannel,
        meta: 'channel'
      },
        // 渠道完善页面
      {
        path: 'viewchannel',
        component: ViewChannel,
        meta: 'channel'
      },
        // 体系列表
      {
        path: 'system',
        component: System,
        meta: 'system'
      },
        // 查看体系
      {
        path: 'systemdel',
        component: SystemDel,
        meta: 'system'
      },
        // 完善体系
      {
        path: 'perfectsystem',
        component: PerfectSystem,
        meta: 'system'
      }
    ],
    meta: null
  },
  // 404 lost
  {
    path: '/lost',
    name: '404',
    component: _404
  }
]

export function check404( to ) {
  const paths = []
  function recursion(routes, path, num) {
    for(let i = 0; i< routes.length; i++){
      if(routes[i].children){
        if(num === 1){
          paths.push(routes[i].path)
          num = null
        }
        recursion(routes[i].children, path + routes[i].path + '/')
      }else{
        paths.push(path + routes[i].path)
      }
    }
  }
  recursion(routes, '', 1)
  return paths.indexOf(to.path) !== -1
    ? false
    : true
}

export default new Router({routes: routes})
