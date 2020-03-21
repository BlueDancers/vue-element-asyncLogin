/*
 * @Author: your name
 * @Date: 2020-03-21 08:29:57
 * @LastEditTime: 2020-03-21 09:09:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-element-asyncLogin/src/permission.js
 */
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
      // 后置添加404页面,防止刷新404
      asyncRouter.push({
        path: "*",
        redirect: "/404",
        hidden: true
      });
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
