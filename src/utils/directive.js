import Vue from 'vue'
import store from '../store'
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
      !store.getters.roles.includes(binding.value)
        ? el.parentNode.removeChild(el)
        : {}
    }
  })
}
