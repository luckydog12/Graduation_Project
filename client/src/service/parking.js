import req from './index'

export const addParking = (data) => {
    return req.request({
      url: '/parking/addParking',
      method: 'post',
      data
    })
}

export const deleteParking = (data) => {
  return req.request({
    url: '/parking/deleteParking',
    method: 'post',
    data
  })
}

export const updateParking = (data, id) => {
  return req.request({
    url: `/parking/updateParking?id=${id}`,
    method: 'post',
    data
  })
}

export const getParking = (data) => {
  return req.request({
    url: '/parking/getParking',
    method: 'post',
    data
  })
}

