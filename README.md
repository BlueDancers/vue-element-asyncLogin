## 记一次Vue动态渲染路由的实现的优化



Vue+Element作为后台管理模板[github](https://link.juejin.im/?target=https%3A%2F%2Fgithub.com%2FPanJiaChen%2Fvue-admin-template)

demo已经部署到github,欢迎体验~~





在今年年初在掘金发布了一篇文章[记一次Vue动态渲染路由的实现](<https://juejin.im/post/5c4a8a05e51d4506953e389b>),现在代码经过不断的Review

现在完全优化了之前的实现方法,代码量减少很多,逻辑更加简单,同时也更加稳定

### 实现思路

1. 路由跳转 先判断是否登录 未登录只能访问白名单页面,访问其他页面全部重定向到登录页面
2. 登录行为触发,获取动态路由,递归解析动态路由信息,并且addRouter,同时存储到Vuex,并且记录获取路由的状态
3. 跳转页面不会获取动态路由,刷新页面重新获取动态路由

![](http://www.vkcyan.top/Fjljtkppg6wMGdZN5bSn5Tlvd1uk.png)



相比较之前使用localStorage存储登录状态,现在把登录状态交给cookice进行管理

路由信息全部交给Vuex进行管理,不再从localStorage里面走,增加了系统的稳定性



配置基础路由

> 具体的实现思路

**router/router.js**

```javascript
// ......
// 静态路由
export const StaticRouterMap = [
  {
    path: '/login',
    component: login,
    meta: { title: '管理员登录' },
    hidden: true
  },
  {
    path: '/user',
    component: userLogin,
    redirect: '/user/userlogin',
    name: 'user',
    hidden: true,
    children: [
      {
        path: 'userLogin',
        component: () => import('@/views/userLogin/components/login'),
        meta: { title: '商户登录' }
      },
      {
        path: 'userRegistry',
        component: () => import('@/views/userLogin/components/registry'),
        meta: { title: '商户注册' }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '根目录', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: StaticRouterMap
})

```

与后端同学定制路由结构 (以下为json)

> 后端会根据当前用户权限动态返回路由结构 前端不再需要考虑权限问题

```json
[{
  "id": 1,
  "name": "Nested",
  "code": null,
  "description": null,
  "url": "/nested",
  "generatemenu": 0,
  "sort": 0,
  "parentId": null,
  "permName": null,
  "redirect": "/nested/menu1",
  "title": "Nested",
  "icon": "nested",
  "children": [{
    "id": 2,
    "name": "Menu1",
    "code": null,
    "description": null,
    "url": "menu1",
    "generatemenu": 0,
    "sort": 0,
    "parentId": 1,
    "permName": null,
    "redirect": "",
    "title": "Menu1",
    "icon": "menu1",
    "children": [{
      "id": 4,
      "name": "Menu1-1",
      "code": null,
      "description": null,
      "url": "menu1-1",
      "generatemenu": 0,
      "sort": 0,
      "parentId": 2,
      "permName": null,
      "redirect": "",
      "title": "Menu1-1",
      "icon": "",
      "children": null
    }, {
      "id": 5,
      "name": "Menu1-2",
      "code": null,
      "description": null,
      "url": "menu1-2",
      "generatemenu": 0,
      "sort": 0,
      "parentId": 2,
      "permName": null,
      "redirect": "",
      "title": "Menu1-2",
      "icon": "",
      "children": null
    }]
  }, {
    "id": 3,
    "name": "Menu2",
    "code": null,
    "description": null,
    "url": "menu2",
    "generatemenu": 0,
    "sort": 0,
    "parentId": 1,
    "permName": null,
    "redirect": "",
    "title": "Menu2",
    "icon": "menu2",
    "children": null
  }]
}]
```

## 解析后端初始路由数据为可用数据

当然这不是直接用于渲染路由 我们需要进行递归处理成为我们想要的数据

**router/_import**

```
export default file => {
  return map[file] || null
}

const map = {
  Nested: () => import('@/views/layout/Layout'),
  Menu1: () => import('@/views/nested/menu1/index'),
  'Menu1-1': () => import('@/views/nested/menu1/menu1-1'),
  'Menu1-2': () => import('@/views/nested/menu1/menu1-2')
}
```

处理后端原始路由数据

`../utils/addRouter`

> 递归写入比之前的递归删除更加稳定,代码量也更少

````javascript
import _import from '../router/_import' // 获取组件的方法

/**
 * 生成路由
 * @param {Array} routerlist 格式化路由
 * @returns
 */
export function addRouter(routerlist) {
  const router = []
  routerlist.forEach(e => {
    let e_new = {
      path: e.url,
      name: e.name,
      component: _import(e.name)
    }
    if (e.children) {
      e_new = Object.assign({}, e_new, { children: addRouter(e.children) })
    }
    if (e.redirect) {
      e_new = Object.assign({}, e_new, { redirect: e.redirect })
    }
    if (e.generatemenu == 0) {
      e_new = Object.assign({}, e_new, { hidden: true })
    }
    if (e.icon !== '' && e.title !== '') {
      e_new = Object.assign({}, e_new, {
        meta: { title: e.title, icon: e.icon }
      })
    } else if (e.title !== '' && e.icon === '') {
      e_new = Object.assign({}, e_new, { meta: { title: e.title }})
    }
    router.push(e_new)
  })
  return router
}
````

处理后的路由

> 我们处理后的路由后面需要与现有的router进行拼接,这里需要根据需求 修改处理路由的规则 

```json
[{
  "name": "Nested",
  "redirect": "/nested/menu1",
  "children": [{
    "name": "Menu1",
    "children": [{
      "name": "Menu1-1",
      "children": null,
      "path": "menu1-1",
      "meta": {
        "title": "Menu1-1"
      }
    }, {
      "name": "Menu1-2",
      "children": null,
      "path": "menu1-2",
      "meta": {
        "title": "Menu1-2"
      }
    }],
    "path": "menu1",
    "meta": {
      "title": "Menu1",
      "icon": "menu1"
    }
  }, {
    "name": "Menu2",
    "children": null,
    "path": "menu2",
    "component": null,
    "meta": {
      "title": "Menu2",
      "icon": "menu2"
    }
  }],
  "path": "/nested",
  "meta": {
    "title": "Nested",
    "icon": "nested"
  }
}]
```

### (核心)合并路由

以上的都是准备工作,就是为了将`初始路由`与后端返回的`动态路由`进行拼接

这部分代码也是优化的核心

```javascript
import router from './router'
import store from './store'
import { getToken, removeToken } from './utils/auth'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { Message } from 'element-ui'
import { getTreeByUser } from './api/login'
import { addRouter } from './utils/addRouter'

const whiteList = ['/login', '/user/userLogin', '/user/userRegistry']
var data = false // 本次demo用变量凑合一下,项目里面应该放到vuex内
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.meta.title) document.title = `xxxx-${to.meta.title}`
  if (getToken()) { // 判断cookice是否存在 不存在即为未登录
    if (to.path !== '/userlogin' && to.path !== '/login') {
      if (data) { // 获取了动态路由 data一定true,就无需再次请求 直接放行
        next()
      } else { // data为false,一定没有获取动态路由,就跳转到获取动态路由的方法
        gotoRouter(to, next)
      }
    } else { 
      Message({ message: '您已经登录', type: 'info' })
      next('/')
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 免登陆白名单 直接进入
      next()
    } else {
      if (to.path !== '/user') { // 重定向到登录页面
        next(`/user/userLogin?redirect=${to.path}`)
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
  getTreeByUser() // 获取动态路由的方法
    .then(res => {
      const asyncRouter = addRouter(res.data.children) // 进行递归解析
      // * 一定不能写在静态路由里面,否则会出现,访问动态路由404的情况.所以在这列添加
      asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
      router.addRoutes(asyncRouter) // vue-router提供的addRouter方法进行路由拼接
      data = true // 记录路由获取状态
      store.dispatch('setRouterList', asyncRouter) // 存储到vuex
      next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
    })
    .catch(() => {
      removeToken() 
    })
}
```

**Vuex内部的逻辑**

````javascript
import { StaticRouterMap } from '../../router/index'

 state: {
    //.....
    RouterList: [] // 动态路由
 },

mutations: {
    set_router: (state, RouterList) => {
      state.RouterList = RouterList
    }
},

action: {
    // 动态设置路由 此为设置设置途径
    setRouterList({ commit }, routerList) {
      commit('set_router', StaticRouterMap.concat(routerList)) // 进行路由拼接并存储
    },
}
````



相对之前的逻辑要简单很多

## 修改侧边栏的应用路由地址

需要注意的是 通过 addRoutes合并的路由 不会被`this.$router.options.routes`获取到,所以需要将获取的路由拼接到`this.$router.options.routes`上

最后修改渲染侧边栏部分部分的代码

`src\views\layout\components\Sidebar\index.vue`

```javascript

 computed: {
	// ....
    routes() {
      return this.$store.getters.routerList
    },
   	// ....
  }
```

![](http://www.vkcyan.top/FmgCbHryrf0wZ5QP5W42cj9MYh1m.gif)

"# vue-element-asyncLogin" 
