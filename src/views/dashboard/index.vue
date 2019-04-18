<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name:{{ name }}</div>
    <div class="dashboard-text">roles:{{ roles }}</div>
    <h2>关于路由</h2>
    <div>{{ name }} 的路由为 {{ showRouter }}</div>
    <div>未解析路由信息请看NetWork的,解析完成的路由信息请看控制台</div>
    <h2>关于权限</h2>
    <p>这里做了简单的权限区分,</p>
    <p>admin 用户存在 "增加", "删除", "修改", "查看" 权限 ,所以根据自定义指令管理员可以操作的按钮都会被渲染出来</p>
    <p>editor 用户 只存在 "修改", "查看" ,所以自定义指令不会渲染 增加 与 删除</p>
    <h3>自定义指令的实现</h3>
    <el-button v-permit="'add'" type="primary">增加</el-button>
    <el-button v-permit="'delete'" type="danger">删除</el-button>
    <el-button v-permit="'edit'" type="warning">修改</el-button>
    <el-button v-permit="'view'" type="success">查看</el-button>
    <h3>v-if的实现</h3>
    <el-button v-if="basePermit('add')" type="primary">增加</el-button>
    <el-button v-if="basePermit('delete')" type="danger">删除</el-button>
    <el-button v-if="basePermit('edit')" type="warning">修改</el-button>
    <el-button v-if="basePermit('view')" type="success">查看</el-button>
    <div class="toggle">
      <el-button size="small" type="primary" @click="toggleUser">切换用户</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { permit } from '../../utils/index.js'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ]),
    showRouter() {
      console.log('全部路由信息', this.$store.getters.routerList)
      if (this.$store.getters.routerList.length > 0) {
        return this.$store.getters.routerList[3].name
      }
      return ''
    }
  },
  methods: {
    toggleUser() {
      // 为什么切换状态要属性页面
      if (this.name === 'editor') {
        this.$store.dispatch('Login', { username: 'admin', password: '' }).then(() => {
          location.reload()
        }).catch(() => {
          this.$message('接口出现了一些问题....')
        })
      } else {
        this.$store.dispatch('Login', { username: 'editor', password: '' }).then(() => {
          location.reload()
        }).catch(() => {
          this.$message('接口出现了一些问题....')
        })
      }
    },
    basePermit(e) {
      return permit(e)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  position: absolute;
  &-container {
    margin: 30px;
    .toggle {
      position: absolute;
      right: 30px;
      top: 30px;
    }
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
