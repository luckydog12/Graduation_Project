const { PayType } = require('../models')

module.exports = {
  async addPayType(req, res) {
    try {
      const payType = await PayType.create(req.body)
      res.send({
        code: 200,
        payType
      })
    } catch (error) {
      let err = []
      if (error.errors) {
        error.errors.forEach(validateError => {
          err.push(validateError.message)
        })
      }
      res.send({
        code: 400,
        error: err.join('<br/>')
      })
    }
  },
  async updatePayType(req, res) {
    try {
      await PayType.update(
        req.body, {
          where: {
            id: req.query.id
          }
        }
      )
      res.send({
        code: 200,
        message: '数据更新成功'
      })
    } catch (error) {
      res.send({
        code: 502,
        error: '数据更新失败'
      })
    }
  },
  async getPayType(req, res) {
    try {
      const payType = await PayType.findAll()
      if (payType) {
        res.send({
          code: 200,
          payType 
        })
      } else {
        res.send({
          code: 502,
          error: '没有找到对应的数据'
        })
      }
    } catch (error) {
      res.send({
        code: 500,
        error: '数据查询失败'
      })
    }
  }
}