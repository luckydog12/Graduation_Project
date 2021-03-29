import req from './index'

export const login = (data) => {
    return req.request({
      url: '/user/login',
      method: 'post',
      data
    })
}

export const register = (data) => {
  return req.request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export const deleteUser = (data) => {
  return req.request({
    url: '/user/delete',
    method: 'post',
    data
  })
}

export const getUsersAll = (data) => {
  return req.request({
    url: '/user/all',
    method: 'post',
    data
  })
}

export const comparePwd = (data, id) => {
  return req.request({
    url: `/user/comparePwd?id=${id}`,
    method: 'post',
    data
  })
}

export const updateUser = (data, id) => {
  return req.request({
    url: `/user/update?id=${id}`,
    method: 'post',
    data
  })
}

export const getUserAccount = (params) => {
  return req.request({
    url: '/user/account',
    method: 'get',
    params
  })
}

export const getUserName = (params) => {
  return req.request({
    url: '/user/name',
    method: 'get',
    params
  })
}