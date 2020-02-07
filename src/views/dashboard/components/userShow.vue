<template>
  <el-dialog
    title="思路"
    :visible.sync="show"
    width="800px"
    :before-close="closeDialog"
  >
    <div>
      <h2>
        代码运行思路(已经登录,刷新页面的情况下)
      </h2>
      <div class="item">
        <div>1. 在路由钩子里面判断是否首次进入系统(permission.js)</div>
        <div>
          2.
          init为true说明已经获取过路由,就直接放行,init为false则向后台请求用户路由
        </div>
        <div>3. 获取路由</div>
        <div>4. 解析路由,存储权限</div>
        <div>5. 使用router的api,addRouter拼接路由</div>
        <div>6. 存储路由</div>
        <div>7. init改为true,路由初始化完成</div>
        <div>8. 放行路由</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  div {
    height: 44px;
    line-height: 44px;
  }
}
</style>
