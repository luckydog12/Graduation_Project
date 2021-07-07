const AliPayFormData = require('alipay-sdk/lib/form').default
const AlipaySdk = require('alipay-sdk').default
const axios = require('axios')
const Axios = axios.create({
  // baseURL: 'http://127.0.0.1:8081/',
  // timeout: 10000
})
module.exports = {
  async alipayTool(req, res) {
    const alipaySdk = new AlipaySdk({
      appId: '2021000117634763',
      signType: 'RSA2', // 签名算法,默认 RSA2
      gateway: 'https://openapi.alipaydev.com/gateway.do', // 支付宝网关地址 ，沙箱环境下使用时需要修改 正式线上的时候换成 https://openapi.alipay.com/gateway.do
      privateKey: 'MIIEowIBAAKCAQEAslB+OFUfmlQuZUHIt3ytYPZDTTponWLfpXBnFypKd6i1cHpYJaEFhKhshnmKpaJfSBC2IRqs66knctTR11rG3+nInVH+Vck67x5Hh6SOVJTlSss5HhBBNdo7Oo605nVOGwVz39CRHkhTo9+XZl13CL8v3CTBP9FWpvG8Q8IvvO+SHZs2QLH4WfyawhPtFoyCsMiw6P9+pFsVRrf4b3DDo596p/qbQBlLdVSCguC4vtE+7X0RPRCe2V+vZDSHLZTP5+n1JeLNm1Kmrjlhr5dGOwBraCJuy5yATLEfL1/lghYLsxLl1erWWb6m9NJvjRcLPYEC0FAnuBllJAIVDRk2owIDAQABAoIBADdo1eARa5GcaRJj/8gswP+pZr5/0PRfPhn9tLs5FAzc6wy5p9yBjeJsJ9UdvZy8uRj+wGnHDUbpuG1xfoeKGNSJpCJm0T69Gkglw5p94xCbeCjmv6f86xad6tvGbqZSe2PgLOK2v/GGDh+VIknX715Tcr7Y2QhIt8GGyrbPh+AQmRikATeB4JYtOdph+XOShR7MvpE+V5FwRdE/hEgpLFN6doOph3Ki5nENXctAJnaDjupRo+s8gZIQxWeCzmRwUfglOR/cNx3tO/gQYWtBIPX9HezbNbgQRY9PIAb/QvDacWICd3QY6RCNLKw7+gNYLqJfhQS7SFoCOR/NXGiKflkCgYEA3eztX8NcG/FWRm55arC6ZQ6dr3nCTAeqJ/gRGCBd9T3xTqPRLQ8wC7/ShnHbQAwm/mAur4gPJDWkRfeSmBkNUa5sj48uTPT1yRMLVCLnaPuMvfdPYltzlRzbZcucn/CJAcX5NLiXqi/PJ5m+S/gkkFcPh1EefIjF2UgvqYsAjlcCgYEAzbFgHZ6/MFEYRNHDngVhLEL4/sUMCVh4+Nph3p2r71yU988dCNHcTNiLXT3v0OKCKL6tLGjI85lh1yl6U0CK4cpTYe36eICYpxVzGNroJxLM131bB6uho4b3Ls9dBfwusYycRPAEE4t3vBRCqN0cyv4zI9OQYxOJwvfCoO810pUCgYEA0kiVKD+CAMwuVvCJRgoNpIIz8jjqXYaJufO5puXMgfvesghRxWN1wDxT7Kbn/IlHTZOvyQ2gY0wcy1tqYYqjbzlajrE6Sxt15cCQ5HlqUrTAyKQVaXqES8+bKJrFX1vZRn/jwgwDUfSZUsnAYlXPt6F3Cl5YB+LFrjxTRVB8B2MCgYAXDYcZKr6AusX+iIflAPNYE5V2cD0eGwVL1qXbXk5zwCuN7m9xmpuXHTnZVGS5Q3mU+XHNJV1IN+uIQsTL6dLm5VcdBZ/pu3fgWf4RTg9wuaGtkQYPwQOXoTu4ylLBpfbRvVGSRFggnKPpt1eVN1rPwVeX71EiWYE6EayFfunIVQKBgC1RGax6zgln99/T2cgCp4C+dLa1J0SGUruyRan2jrNCpFPjkAy8igrSmhQXa4PfVTdjgbOdMkQndGXiEjsNQ05c0XJdfq41H9EDB39v3YvnB1yHfDrSAKB4dGU8EEmagtwzuuDgFBdNJ/b9VNvXMcAOhJkmvyUT6Br1DwE6bI++',
      alipayPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqw8h1HfyzaEjQj85/xDusxrON1UCFViJoacKsoib4z/o34111n7PK++T8+Hq5tywBKCE+VhFOuh3tyFg/cMJfNyr8oq3+TCfng9Q/TuLe0Kg9ksy1TxdQlv7gvoyzd7cjHZNjtDtWWpnHZp2tP7+AYsORlo5Rxd8x352NRLyomV+VOLc7NdUUfQfRnikPa15cPK2FJMVRStDs0HvrKNmZQMlnD+WrJ6l7HZ7AXaPG5+I8uqVM0cUEkpDritTCbictFfhtuI4IcWDemgSTC/zyGz981FWbzYjAplP8vBOZITzqXk20q/gml3WKiNB13Znzb+NxswqdT0bkBSognmyiwIDAQAB'
    })
    const formData = new AliPayFormData()
    formData.setMethod('get')
    formData.addField('appId', '2021000117634763')
    formData.addField('charset', 'utf-8')
    formData.addField('signType', 'RSA2')
    // formData.addField('notifyUrl', 'https://www.baidu.com');
    formData.addField('returnUrl', 'http://127.0.0.1:8080/payment')
    formData.addField('bizContent', {
      outTradeNo: req.body.outTradeNo,
      productCode: 'FAST_INSTANT_TRADE_PAY',
      totalAmount: req.body.totalAmount,
      subject: req.body.subject
    })
    const result = await alipaySdk.exec(
      'alipay.trade.page.pay', {}, {
        formData: formData
      }
    )
    return res.json({
      status: 200,
      result
    })
  },
  async payStatus(req, res) {
    let outTradeNo = req.body.outTradeNo
    const formData = new AliPayFormData()
    formData.setMethod('get');
    formData.addField('bizContent', {
      outTradeNo
    });
    // 通过该接口主动查询订单状态
    const alipaySdk = new AlipaySdk({
      appId: '2021000117634763',
      signType: 'RSA2', // 签名算法,默认 RSA2
      gateway: 'https://openapi.alipaydev.com/gateway.do', // 支付宝网关地址 ，沙箱环境下使用时需要修改 正式线上的时候换成 https://openapi.alipay.com/gateway.do
      privateKey: 'MIIEowIBAAKCAQEAslB+OFUfmlQuZUHIt3ytYPZDTTponWLfpXBnFypKd6i1cHpYJaEFhKhshnmKpaJfSBC2IRqs66knctTR11rG3+nInVH+Vck67x5Hh6SOVJTlSss5HhBBNdo7Oo605nVOGwVz39CRHkhTo9+XZl13CL8v3CTBP9FWpvG8Q8IvvO+SHZs2QLH4WfyawhPtFoyCsMiw6P9+pFsVRrf4b3DDo596p/qbQBlLdVSCguC4vtE+7X0RPRCe2V+vZDSHLZTP5+n1JeLNm1Kmrjlhr5dGOwBraCJuy5yATLEfL1/lghYLsxLl1erWWb6m9NJvjRcLPYEC0FAnuBllJAIVDRk2owIDAQABAoIBADdo1eARa5GcaRJj/8gswP+pZr5/0PRfPhn9tLs5FAzc6wy5p9yBjeJsJ9UdvZy8uRj+wGnHDUbpuG1xfoeKGNSJpCJm0T69Gkglw5p94xCbeCjmv6f86xad6tvGbqZSe2PgLOK2v/GGDh+VIknX715Tcr7Y2QhIt8GGyrbPh+AQmRikATeB4JYtOdph+XOShR7MvpE+V5FwRdE/hEgpLFN6doOph3Ki5nENXctAJnaDjupRo+s8gZIQxWeCzmRwUfglOR/cNx3tO/gQYWtBIPX9HezbNbgQRY9PIAb/QvDacWICd3QY6RCNLKw7+gNYLqJfhQS7SFoCOR/NXGiKflkCgYEA3eztX8NcG/FWRm55arC6ZQ6dr3nCTAeqJ/gRGCBd9T3xTqPRLQ8wC7/ShnHbQAwm/mAur4gPJDWkRfeSmBkNUa5sj48uTPT1yRMLVCLnaPuMvfdPYltzlRzbZcucn/CJAcX5NLiXqi/PJ5m+S/gkkFcPh1EefIjF2UgvqYsAjlcCgYEAzbFgHZ6/MFEYRNHDngVhLEL4/sUMCVh4+Nph3p2r71yU988dCNHcTNiLXT3v0OKCKL6tLGjI85lh1yl6U0CK4cpTYe36eICYpxVzGNroJxLM131bB6uho4b3Ls9dBfwusYycRPAEE4t3vBRCqN0cyv4zI9OQYxOJwvfCoO810pUCgYEA0kiVKD+CAMwuVvCJRgoNpIIz8jjqXYaJufO5puXMgfvesghRxWN1wDxT7Kbn/IlHTZOvyQ2gY0wcy1tqYYqjbzlajrE6Sxt15cCQ5HlqUrTAyKQVaXqES8+bKJrFX1vZRn/jwgwDUfSZUsnAYlXPt6F3Cl5YB+LFrjxTRVB8B2MCgYAXDYcZKr6AusX+iIflAPNYE5V2cD0eGwVL1qXbXk5zwCuN7m9xmpuXHTnZVGS5Q3mU+XHNJV1IN+uIQsTL6dLm5VcdBZ/pu3fgWf4RTg9wuaGtkQYPwQOXoTu4ylLBpfbRvVGSRFggnKPpt1eVN1rPwVeX71EiWYE6EayFfunIVQKBgC1RGax6zgln99/T2cgCp4C+dLa1J0SGUruyRan2jrNCpFPjkAy8igrSmhQXa4PfVTdjgbOdMkQndGXiEjsNQ05c0XJdfq41H9EDB39v3YvnB1yHfDrSAKB4dGU8EEmagtwzuuDgFBdNJ/b9VNvXMcAOhJkmvyUT6Br1DwE6bI++',
      alipayPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqw8h1HfyzaEjQj85/xDusxrON1UCFViJoacKsoib4z/o34111n7PK++T8+Hq5tywBKCE+VhFOuh3tyFg/cMJfNyr8oq3+TCfng9Q/TuLe0Kg9ksy1TxdQlv7gvoyzd7cjHZNjtDtWWpnHZp2tP7+AYsORlo5Rxd8x352NRLyomV+VOLc7NdUUfQfRnikPa15cPK2FJMVRStDs0HvrKNmZQMlnD+WrJ6l7HZ7AXaPG5+I8uqVM0cUEkpDritTCbictFfhtuI4IcWDemgSTC/zyGz981FWbzYjAplP8vBOZITzqXk20q/gml3WKiNB13Znzb+NxswqdT0bkBSognmyiwIDAQAB'
    })
    alipaySdk.exec(
      'alipay.trade.query', {}, {
        formData: formData
      },
    ).then(result => {
      Axios.request({
          method: 'GET',
          url: result
        }).then(data => {
          console.log('data', data)
          let r = data.data.alipay_trade_query_response;
          if (r.code === '10000') { // 接口调用成功
            switch (r.trade_status) {
              case 'WAIT_BUYER_PAY':
                res.send({
                  "success": true,
                  "message": "success",
                  "code": 200,
                  "timestamp": (new Date()).getTime(),
                  "result": {
                    "status": 0,
                    "massage": '交易创建，等待买家付款'
                  }
                })
                break;
              case 'TRADE_CLOSED':
                res.send({
                  "success": true,
                  "message": "success",
                  "code": 200,
                  "timestamp": (new Date()).getTime(),
                  "result": {
                    "status": 1,
                    "massage": '未付款交易超时关闭，或支付完成后全额退款'
                  }
                })
                break;
              case 'TRADE_SUCCESS':
                res.send({
                  "success": true,
                  "message": "success",
                  "code": 200,
                  "timestamp": (new Date()).getTime(),
                  "result": {
                    "status": 2,
                    "massage": '交易支付成功'
                  }
                })
                break;
              case 'TRADE_FINISHED':
                res.send({
                  "success": true,
                  "message": "success",
                  "code": 200,
                  "timestamp": (new Date()).getTime(),
                  "result": {
                    "status": 3,
                    "massage": '交易结束，不可退款'
                  }
                })
                break;
            }
          } else if (r.code === '40004') {
            res.send('交易不存在');
          }
        })
        .catch(err => {
          console.log(err)
          res.json({
            msg: '查询失败',
            err
          })
        })
    })

  }
}