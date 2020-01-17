import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function getRouter(roule) {
  return request({
    url: '/vue-admin-template/user/getRouter',
    method: 'post',
    data: {
      type: roule
    }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
