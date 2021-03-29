import req from './index'

export const addService = (data) => {
    return req.request({
      url: '/service/addService',
      method: 'post',
      data
    })
}


export const deleteService = (id) => {
  return req.request({
    url: `/service/deleteService?id=${id}`,
    method: 'post'
  })
}

export const getService = (data) => {
  return req.request({
    url: '/service/getService',
    method: 'post',
    data
  })
}

export const updateService = (data, id) => {
  return req.request({
    url: `/service/updateService?id=${id}`,
    method: 'post',
    data
  })
}