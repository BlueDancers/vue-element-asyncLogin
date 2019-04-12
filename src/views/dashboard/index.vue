<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name:{{ name }}</div>
    <div class="dashboard-text">
      roles:
      <span v-for="role in roles" :key="role">{{ role }}</span>
    </div>
    <div>{{ name }} 的路由为 {{ showRouter }}</div>
    <div>未解析路由信息请看NetWork的,解析完成的路由信息请看控制台</div>
    <div>管理员{{roles}}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

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
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
