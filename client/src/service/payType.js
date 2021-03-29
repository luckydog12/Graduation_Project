import req from './index'

export const addPayType = (data) => {
    return req.request({
      url: '/payType/addPayType',
      method: 'post',
      data
    })
}

export const getPayType = () => {
  return req.request({
    url: '/payType/getPayType',
    method: 'get'
  })
}

export const updatePayType = (data, id) => {
  return req.request({
    url: `/payType/updatePayType?id=${id}`,
    method: 'post',
    data
  })
}
