import req from './index'

export const addHouse = (data) => {
    return req.request({
      url: '/house/addHouse',
      method: 'post',
      data
    })
}

export const deleteHouse = (data) => {
  return req.request({
    url: '/house/deleteHouse',
    method: 'post',
    data
  })
}

export const updateHouse = (data, id) => {
  return req.request({
    url: `/house/updateHouse?id=${id}`,
    method: 'post',
    data
  })
}

export const getHouse = (data) => {
  return req.request({
    url: '/house/getHouse',
    method: 'post',
    data
  })
}

export const getHouseAll = () => {
  return req.request({
    url: '/house/getHouseAll',
    method: 'get'
  })
}