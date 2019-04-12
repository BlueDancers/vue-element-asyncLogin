import router from './router'
import store from './store'
import { getToken, removeToken } from './utils/auth'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { Message } from 'element-ui'
import { getRouter } from './api/login'
import { addRouter } from './utils/addRouter'

const whiteList = ['/login']
var data = false // 本次demo用变量凑合一下,项目里面应该放到vuex内
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    // 判断cookice是否存在 不存在即为未登录
    if (to.path !== '/login') {
      if (data) {
        // 获取了动态路由 data一定true,就无需再次请求 直接放行
        next()
      } else {
        // data为false,一定没有获取动态路由,就跳转到获取动态路由的方法
        gotoRouter(to, next)
      }
    } else {
      Message({ message: '您已经登录', type: 'info' })
      next('/')
    }
  } else {
    data = false
    if (whiteList.indexOf(to.path) !== -1) {
      // 免登陆白名单 直接进入
      next()
    } else {
      if (to.path !== '/login') {
        // 重定向到登录页面 不能这么写 因为假如之前的角色是 管理员页面 后又登陆了非管理员 重定向的页面就可能不存在,就会导致404
        // next(`/login?redirect=${to.path}`)
        next('/login')
      } else {
        next()
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})

function gotoRouter(to, next) {
  getRouter(store.getters.token) // 获取动态路由的方法
    .then(res => {
      console.log('解析后端动态路由', res.data.data.router)
      const asyncRouter = addRouter(res.data.data.router) // 进行递归解析
      store.dispatch('setroles', res.data.data.permit)
      // 一定不能写在静态路由里面,否则会出现,访问动态路由404的情况.所以在这列添加
      asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
      return asyncRouter
    })
    .then(asyncRouter => {
      router.addRoutes(asyncRouter) // vue-router提供的addRouter方法进行路由拼接
      data = true // 记录路由获取状态
      store.dispatch('setRouterList', asyncRouter) // 存储到vuex
      store.dispatch('GetInfo')
      next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
    })
    .catch(e => {
      console.log(e)
      removeToken()
    })
}
