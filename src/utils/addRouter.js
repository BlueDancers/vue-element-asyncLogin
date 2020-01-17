import _import from '../router/_import' // 获取组件的方法

/**
 * 生成路由
 * @param {Array} routerlist 格式化路由
 * @returns
 */
export function addRouter(routerlist) {
  const router = []
  console.log('递归', routerlist)
  try {
    routerlist.forEach(e => {
      if (_import(e.name) == null) {
        throw new Error('存在未匹配到的路由' + e.name)
      }
      let e_new = {
        path: e.url,
        name: e.name,
        component: _import(e.name)
      }
      if (e.children) {
        const children = addRouter(e.children)
        // 保存权限
        e_new = { ...e_new, children: children }
      }
      if (e.redirect) {
        e_new = { ...e_new, redirect: e.redirect }
      }
      if (e.generatemenu === 0) {
        e_new = { ...e_new, hidden: true }
      }
      if (e.icon !== '' && e.title !== '') {
        e_new = { ...e_new, meta: { title: e.title, icon: e.icon }}
      } else if (e.title !== '' && e.icon === '') {
        e_new = { ...e_new, meta: { title: e.title }}
      }
      router.push(e_new)
    })
  } catch (error) {
    console.error(error)
    return []
  }
  return router
}
