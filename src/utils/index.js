import store from '../store'

/**
 * 效验权限
 * @param {String} e 权限标号
 */
export function permit(e) {
  if (store.getters.roles.includes(e)) {
    return true
  } else {
    return false
  }
}
