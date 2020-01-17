(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3c9ec68f"],{"430d":function(e,t,s){"use strict";var r=s("c26a"),a=s.n(r);a.a},9406:function(e,t,s){"use strict";s.r(t);var r=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"dashboard-container"},[s("div",{staticClass:"dashboard-text"},[e._v("name(用户权限等级):"+e._s(e.name))]),e._v(" "),s("div",{staticClass:"dashboard-text"},[e._v("roles(按钮级别权限):"+e._s(e.roles))]),e._v(" "),s("h2",[e._v("关于路由")]),e._v(" "),s("div",[e._v(e._s(e.name)+" 的路由为 "+e._s(e.showRouter))]),e._v(" "),s("div",[e._v("未解析路由信息请看NetWork的,解析完成的路由信息请看控制台")]),e._v(" "),s("h2",[e._v("关于权限")]),e._v(" "),s("p",[e._v("这里做了简单的权限区分,")]),e._v(" "),s("p",[e._v('\n    admin 用户存在 "增加", "删除", "修改", "查看" 权限\n    ,所以根据自定义指令管理员可以操作的按钮都会被渲染出来\n  ')]),e._v(" "),s("p",[e._v('\n    editor 用户 只存在 "修改", "查看" ,所以自定义指令不会渲染 增加 与 删除\n  ')]),e._v(" "),s("h3",[e._v("自定义指令的实现")]),e._v(" "),s("el-button",{directives:[{name:"permit",rawName:"v-permit",value:"add",expression:"'add'"}],attrs:{type:"primary"}},[e._v("增加")]),e._v(" "),s("el-button",{directives:[{name:"permit",rawName:"v-permit",value:"delete",expression:"'delete'"}],attrs:{type:"danger"}},[e._v("删除")]),e._v(" "),s("el-button",{directives:[{name:"permit",rawName:"v-permit",value:"edit",expression:"'edit'"}],attrs:{type:"warning"}},[e._v("修改")]),e._v(" "),s("el-button",{directives:[{name:"permit",rawName:"v-permit",value:"view",expression:"'view'"}],attrs:{type:"success"}},[e._v("查看")]),e._v(" "),s("h3",[e._v("v-if的实现")]),e._v(" "),e.basePermit("add")?s("el-button",{attrs:{type:"primary"}},[e._v("增加")]):e._e(),e._v(" "),e.basePermit("delete")?s("el-button",{attrs:{type:"danger"}},[e._v("删除")]):e._e(),e._v(" "),e.basePermit("edit")?s("el-button",{attrs:{type:"warning"}},[e._v("修改")]):e._e(),e._v(" "),e.basePermit("view")?s("el-button",{attrs:{type:"success"}},[e._v("查看")]):e._e(),e._v(" "),s("div",{staticClass:"toggle"},[s("el-button",{attrs:{size:"small",type:"primary"},on:{click:e.toggleUser}},[e._v("切换用户")])],1)],1)},a=[],i=(s("6762"),s("2fdb"),s("7f7f"),s("db72")),n=s("2f62"),o={name:"Dashboard",computed:Object(i["a"])({},Object(n["b"])(["name","roles"]),{showRouter:function(){return console.log("全部路由信息",this.$store.getters.routerList),this.$store.getters.routerList.length>0?this.$store.getters.routerList.reduce((function(e,t){return e.concat(t.path)}),[]):""}}),methods:{toggleUser:function(){var e=this;"Normal Editor"===this.name?this.$store.dispatch("user/login",{username:"admin",password:""}).then((function(){location.reload()})).catch((function(){e.$message("接口出现了一些问题....")})):"Super Admin"===this.name&&this.$store.dispatch("user/login",{username:"editor",password:""}).then((function(){location.reload()})).catch((function(){e.$message("接口出现了一些问题....")}))},basePermit:function(e){return this.$store.getters.roles.includes(e)}}},v=o,c=(s("430d"),s("2877")),d=Object(c["a"])(v,r,a,!1,null,"0fb42c32",null);t["default"]=d.exports},c26a:function(e,t,s){}}]);