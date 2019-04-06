import _import from '../router/_import' // 获取组件的方法

/**
 * 生成路由
 * @param {Array} routerlist 格式化路由
 * @returns
 */
export function addRouter(routerlist) {
  const router = []
  routerlist.forEach(e => {
    let e_new = {
      path: e.url,
      name: e.name,
      component: _import(e.name)
    }
    if (e.children) {
      e_new = Object.assign({}, e_new, { children: addRouter(e.children) })
    }
    if (e.redirect) {
      e_new = Object.assign({}, e_new, { redirect: e.redirect })
    }
    if (e.generatemenu === 1) {
      e_new = Object.assign({}, e_new, { hidden: true })
    }
    if (e.icon !== '' && e.title !== '') {
      e_new = Object.assign({}, e_new, {
        meta: { title: e.title, icon: e.icon }
      })
    } else if (e.title !== '' && e.icon === '') {
      e_new = Object.assign({}, e_new, { meta: { title: e.title }})
    }
    router.push(e_new)
  })
  return router
}
