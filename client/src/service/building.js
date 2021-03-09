import req from './index'

export const addBuilding = (data) => {
    return req.request({
      url: '/building/addBuilding',
      method: 'post',
      data
    })
}

export const deleteBuilding = (data) => {
  return req.request({
    url: '/building/deleteBuilding',
    method: 'post',
    data
  })
}

export const updateBuilding = (data, id) => {
  return req.request({
    url: `/building/updateBuilding?id=${id}`,
    method: 'post',
    data
  })
}

export const getBuilding = (data) => {
  return req.request({
    url: '/building/getBuilding',
    method: 'post',
    data
  })
}

export const getBuildingNameAll = () => {
  return req.request({
    url: '/building/getBuildingNameAll',
    method: 'get'
  })
}