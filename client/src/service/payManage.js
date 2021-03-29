import req from './index'

export const addPayManage = (data) => {
    return req.request({
      url: '/payManage/addPayManage',
      method: 'post',
      data
    })
}


export const deletePayManage = (data) => {
  return req.request({
    url: '/payManage/deletePayManage',
    method: 'post',
    data
  })
}

export const getPayManage = (data) => {
  return req.request({
    url: '/payManage/getPayManage',
    method: 'post',
    data
  })
}

export const updatePayManage = (data, id) => {
  return req.request({
    url: `/payManage/updatePayManage?id=${id}`,
    method: 'post',
    data
  })
}
