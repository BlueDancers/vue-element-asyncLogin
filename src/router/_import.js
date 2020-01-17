export default file => {
  return map[file] || null
}

const map = {
  Nested: () => import('@/layout'),
  Menu1: () => import('@/views/nested/menu1/index'),
  'Menu1-1': () => import('@/views/nested/menu1/menu1-1'),
  'Menu1-2': () => import('@/views/nested/menu1/menu1-2'),
  Menu2: () => import('@/views/nested/menu2/index'),
  form: () => import('@/layout'),
  Form: () => import('@/views/form/index'),
  Example: () => import('@/layout'),
  Table: () => import('@/views/table/index'),
  Tree: () => import('@/views/tree/index')
}
