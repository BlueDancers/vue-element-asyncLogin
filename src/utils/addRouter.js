/**
 * 生成路由
 * @param {Array} routerlist 格式化路由
 * @returns
 */
export function addRouter(routerlist) {
  const router = []
  try {
    routerlist.forEach(e => {
      let e_new = {
        path: e.url,
        name: e.name,
        component: resolve => e.component === 'layout' ? require([`@/layout`], resolve) : require([`@/views/${e.component}/index`], resolve)
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
        e_new = { ...e_new, meta: { title: e.title, icon: e.icon } }
      } else if (e.title !== '' && e.icon === '') {
        e_new = { ...e_new, meta: { title: e.title } }
      }
      router.push(e_new)
    })
  } catch (error) {
    console.error(error)
    return []
  }
  return router
}
