# Vue 中后台鉴权的另一种方案 - 动态路由

![](http://www.vkcyan.top/FrMSq8o3pbYN1jI1ZNJUIi4RfYq4.svg)

案例: [vue-element-asyncLogin](https://github.com/vkcyan/vue-element-asyncLogin)

### 2020-5-25 更新

修复动态导入组件问题

### 2020-3-21 更新

修复刷新 404 的 bug

### 2020-2-8 更新

优化流程,简化逻辑,去除\_import.js 文件,改为直接动态导入

优化 404 页面

### 2020-1-17 更新

更新为最新的 vue-element-template 的模板

增加思路说明

优化部分代码

增加 QQ 交流群,有问题请加群

<img src="http://www.vkcyan.top/FoCFV-EDdLZKPfgEC5OVvNH-_9Hd.jpg" />

### 前言

在今年年初在掘金发布了一篇文章[记一次 Vue 动态渲染路由的实现](https://juejin.im/post/5c4a8a05e51d4506953e389b),现在代码经过不断的 Review

现在完全优化了之前的实现方法,代码量减少很多,逻辑更加简单,同时也更加稳定

demo 已经部署到 github,欢迎体验~~ [vue-element-asyncLogin](https://github.com/vkcyan/vue-element-asyncLogin), 你的 start 是我的动力!

### 鉴权-前端路由 VS 鉴权-动态路由

​ 前端路由鉴权相信只要了解过[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin/)的都知道,前端鉴权方案是完全可行的,思路清晰,难度适中,项目中完全可以使用,那么相对来说动态路由优势在什么地方呢

1. 前端鉴权不够灵活,线上版本每次修改权限页面,都需要重新打包项目
2. 中小型项目中 `前端鉴权`明显更加好用,成本更低,程序员们也不用 996 了(雾),但是对于权限等级很多,并且比较大的项目,维护这一套鉴权路由,毫无疑问是一个大工程,并且面对频繁变更的需求,bug 会出现的更加频繁,前端工程师工作量大大增加,这时候似乎前端鉴权就不再是好的方案
3. 动态路由并不是回归到刀耕火种的时代,而是一种新的思路,路由配置还是由前端完成,仅仅将状态交给了后端,不同角色的路由显示交给后端控制,前端不需要管理路由,最多只需要管理权限颗粒化的问题

​

### 实现思路

1. 路由跳转 先判断是否登录 未登录只能访问白名单页面,访问其他页面全部重定向到登录页面
2. 登录行为触发,获取动态路由,递归解析动态路由信息,并且 addRouter,同时存储到 Vuex,并且记录获取路由的状态
3. 跳转页面不会获取动态路由,刷新页面重新获取动态路由

![](http://www.vkcyan.top/Fjljtkppg6wMGdZN5bSn5Tlvd1uk.png)

相比较之前使用 localStorage 存储登录状态,现在把登录状态交给 cookice 进行管理

路由信息全部交给 Vuex 进行管理,不再从 localStorage 里面走,增加了系统的稳定性

配置基础路由

> 具体的实现思路

**router/router.js**

```javascript
// ......
// 静态路由
export const StaticRouterMap = [
  {
    path: "/login",
    component: login,
    meta: { title: "管理员登录" },
    hidden: true
  },
  {
    path: "/user",
    component: userLogin,
    redirect: "/user/userlogin",
    name: "user",
    hidden: true,
    children: [
      {
        path: "userLogin",
        component: () => import("@/views/userLogin/components/login"),
        meta: { title: "商户登录" }
      },
      {
        path: "userRegistry",
        component: () => import("@/views/userLogin/components/registry"),
        meta: { title: "商户注册" }
      }
    ]
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    name: "dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "根目录", icon: "dashboard", affix: true }
      }
    ]
  },
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  }
];

export default new Router({
  mode: "history",
  scrollBehavior: () => ({ y: 0 }),
  routes: StaticRouterMap
});
```

与后端同学定制路由结构 (以下为 json)

> 后端会根据当前用户权限动态返回路由结构 前端不再需要考虑权限问题

```json
[
  {
    "id": 1,
    "name": "Example",
    "code": null,
    "description": null,
    "url": "/example",
    "component": "layout",
    "generatemenu": 1,
    "sort": 0,
    "parentId": null,
    "permName": null,
    "redirect": "/example/table",
    "title": "普通用户",
    "icon": "example",
    "children": [
      {
        "id": 2,
        "name": "Table",
        "code": null,
        "description": null,
        "url": "table",
        "component": "table",
        "generatemenu": 1,
        "sort": 0,
        "parentId": 1,
        "permName": null,
        "redirect": "",
        "title": "Table",
        "icon": "table",
        "children": null
      },
      {
        "id": 3,
        "name": "Tree",
        "code": null,
        "description": null,
        "url": "tree",
        "component": "tree",
        "generatemenu": 1,
        "sort": 0,
        "parentId": 1,
        "permName": null,
        "redirect": "",
        "title": "Tree",
        "icon": "tree",
        "children": null
      }
    ]
  }
]
```

## 解析后端初始路由数据为可用数据

处理后端原始路由数据

`../utils/addRouter`

> 递归写入比之前版本的递归删除更加稳定,代码量也更少
>
> 注意,**路由结构与目录结构是对应的**

```javascript
/**
 * 生成路由
 * @param {Array} routerlist 格式化路由
 * @returns
 */
export function addRouter(routerlist) {
  const router = [];
  try {
    routerlist.forEach(e => {
      let e_new = {
        path: e.url,
        name: e.name,
        component: () =>
          e.component === "layout"
            ? import("@/layout")
            : import(`@/views/${e.component}/index`)
      };
      if (e.children) {
        const children = addRouter(e.children);
        // 保存权限
        e_new = { ...e_new, children: children };
      }
      if (e.redirect) {
        e_new = { ...e_new, redirect: e.redirect };
      }
      if (e.generatemenu === 0) {
        e_new = { ...e_new, hidden: true };
      }
      if (e.icon !== "" && e.title !== "") {
        e_new = { ...e_new, meta: { title: e.title, icon: e.icon } };
      } else if (e.title !== "" && e.icon === "") {
        e_new = { ...e_new, meta: { title: e.title } };
      }
      router.push(e_new);
    });
  } catch (error) {
    console.error(error);
    return [];
  }
  return router;
}
```

处理后的路由

> 我们处理后的路由后面需要与现有的 router 进行拼接,这里需要根据需求 修改处理路由的规则

### (核心)合并路由

以上的都是准备工作,就是为了将`初始路由`与后端返回的`动态路由`进行拼接

这部分代码也是优化的核心

```javascript
import router from "./router";
import store from "./store";
import user from "./store/modules/user";
import { getToken, removeToken } from "./utils/auth";
import NProgress from "nprogress"; // Progress 进度条
import "nprogress/nprogress.css"; // Progress 进度条样式
import { Message } from "element-ui";
import { getRouter } from "./api/login";
import { addRouter } from "./utils/addRouter";

const whiteList = ["/login"];
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (getToken()) {
    // 判断cookice是否存在 不存在即为未登录
    if (to.path !== "/login") {
      if (user.state.init) {
        // 获取了动态路由 data一定true,就无需再次请求 直接放行
        next();
      } else {
        // data为false,一定没有获取动态路由,就跳转到获取动态路由的方法
        gotoRouter(to, next);
      }
    } else {
      Message({ message: "您已经登录", type: "info" });
      next("/");
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 免登陆白名单 直接进入
      next();
    } else {
      if (to.path !== "/login") {
        // 重定向到登录页面 不能这么写 因为假如之前的角色是 管理员页面 后又登陆了非管理员 重定向的页面就可能不存在,就会导致404
        // next(`/login?redirect=${to.path}`)
        next("/login");
      } else {
        next();
      }
    }
  }
});

router.afterEach((to, from) => {
  NProgress.done(); // 结束Progress
});

function gotoRouter(to, next) {
  getRouter(store.getters.token) // 获取动态路由的方法
    .then(res => {
      console.log("解析后端动态路由", res);
      const asyncRouter = addRouter(res.data.router); // 进行递归解析
      store.dispatch("user/setroles", res.data.permit);
      return asyncRouter;
    })
    .then(asyncRouter => {
      router.addRoutes(asyncRouter); // vue-router提供的addRouter方法进行路由拼接
      console.log(asyncRouter);
      store.dispatch("user/setRouterList", asyncRouter); // 存储到vuex
      store.dispatch("user/GetInfo");
      store.commit("user/set_init", true);
      next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
    })
    .catch(e => {
      console.log(e);
      removeToken();
    });
}
```

**Vuex 内部的逻辑**

```javascript
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
```

相对之前的逻辑要简单很多

## 修改侧边栏的应用路由地址

需要注意的是 通过 addRoutes 合并的路由 不会被`this.$router.options.routes`获取到,所以需要将获取的路由拼接到`this.$router.options.routes`上

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

我已精心准备了一个简单的 demo [vue-element-asyncLogin](https://github.com/vkcyan/vue-element-asyncLogin),欢迎体验,如果对你有帮助,请不要吝啬你的 start~~1
