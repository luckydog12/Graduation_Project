import req from './index'

export const addBulletin = (data) => {
    return req.request({
      url: '/bulletin/addBulletin',
      method: 'post',
      data
    })
}


export const deleteBulletin = (id) => {
  return req.request({
    url: `/bulletin/deleteBulletin?id=${id}`,
    method: 'post'
  })
}

export const getBulletin = (data) => {
  return req.request({
    url: '/bulletin/getBulletin',
    method: 'post',
    data
  })
}

export const updateBulletin = (data, id) => {
  return req.request({
    url: `/bulletin/updateBulletin?id=${id}`,
    method: 'post',
    data
  })
}