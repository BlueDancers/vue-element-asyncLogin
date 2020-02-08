const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar:
      'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar:
      'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default [
  // user login
  {
    url: '/vue-admin-template/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/vue-admin-template/user/info.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },
  {
    url: '/vue-admin-template/user/getRouter',
    type: 'post',
    response: type => {
      if (type.body.type === 'admin-token') {
        return {
          code: 20000,
          data: {
            router: [
              {
                id: 1,
                name: 'Nested',
                code: null,
                description: null,
                url: '/nested',
                component: 'layout',
                generatemenu: 1,
                sort: 0,
                parentId: null,
                permName: null,
                redirect: '/nested/menu1',
                title: '管理员路由',
                icon: 'nested',
                children: [
                  {
                    id: 2,
                    name: 'Menu1',
                    code: null,
                    description: null,
                    url: 'menu1',
                    component: 'nested/menu1',
                    generatemenu: 1,
                    sort: 0,
                    parentId: 1,
                    permName: null,
                    redirect: '',
                    title: 'Menu1',
                    icon: 'menu1',
                    children: [
                      {
                        id: 4,
                        name: 'Menu1-1',
                        code: null,
                        description: null,
                        url: 'menu1-1',
                        component: 'nested/menu1/menu1-1',
                        generatemenu: 1,
                        sort: 0,
                        parentId: 2,
                        permName: null,
                        redirect: '',
                        title: 'Menu1-1',
                        icon: '',
                        children: null
                      },
                      {
                        id: 5,
                        name: 'Menu1-2',
                        code: null,
                        description: null,
                        url: 'menu1-2',
                        component: 'nested/menu1/menu1-2',
                        generatemenu: 1,
                        sort: 0,
                        parentId: 2,
                        permName: null,
                        redirect: '',
                        title: 'Menu1-2',
                        icon: '',
                        children: null
                      }
                    ]
                  },
                  {
                    id: 3,
                    name: 'Menu2',
                    code: null,
                    description: null,
                    url: 'menu2',
                    component: 'nested/menu2',
                    generatemenu: 1,
                    sort: 0,
                    parentId: 1,
                    permName: null,
                    redirect: '',
                    title: 'Menu2',
                    icon: 'menu2',
                    children: null
                  }
                ]
              }
            ],
            permit: ['add', 'delete', 'edit', 'view']
          }
        }
      } else if (type.body.type === 'editor-token') {
        return {
          code: 20000,
          data: {
            router: [
              {
                id: 1,
                name: 'Example',
                code: null,
                description: null,
                url: '/example',
                component: 'layout',
                generatemenu: 1,
                sort: 0,
                parentId: null,
                permName: null,
                redirect: '/example/table',
                title: '普通用户',
                icon: 'example',
                children: [
                  {
                    id: 2,
                    name: 'Table',
                    code: null,
                    description: null,
                    url: 'table',
                    component: 'table',
                    generatemenu: 1,
                    sort: 0,
                    parentId: 1,
                    permName: null,
                    redirect: '',
                    title: 'Table',
                    icon: 'table',
                    children: null
                  },
                  {
                    id: 3,
                    name: 'Tree',
                    code: null,
                    description: null,
                    url: 'tree',
                    component: 'tree',
                    generatemenu: 1,
                    sort: 0,
                    parentId: 1,
                    permName: null,
                    redirect: '',
                    title: 'Tree',
                    icon: 'tree',
                    children: null
                  }
                ]
              }
            ],
            permit: ['edit', 'view']
          }
        }
      }
    }
  },
  // user logout
  {
    url: '/vue-admin-template/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
