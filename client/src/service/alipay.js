import req from './index'

export const alipay = (data) => {
    return req.request({
      url: '/alipay/sandbox',
      method: 'post',
      data
    })
}

export const payStatus = (data) => {
  return req.request({
    url: '/alipay/payStatus',
    method: 'post',
    data
  })
}