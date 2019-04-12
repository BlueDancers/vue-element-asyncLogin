import Vue from 'vue'
/**
 * @export 自定义指令
 */
export function directive() {
  Vue.directive('focus', {
    inserted: function(el) {
      el.focus()
    }
  })
  Vue.directive('permit', {
    bind(el, binding) {
      console.log(this.$store.getters.roles)
      if (binding.value === '1111') {
        console.log('权限通过')
      } else {
        el.parentNode.removeChild(el)
      }
    }
  })
}
