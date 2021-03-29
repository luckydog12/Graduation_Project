const { PayManage, User, PayType } = require('../models')
const Sequelize = require(`sequelize`)
const Op = Sequelize.Op

module.exports = {
  async addPayManage(req, res) {
    try {
      const payManage = await PayManage.create(req.body)
      res.send({
        code: 200,
        payManage
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
  async deletePayManage(req, res) {
    try {
      await PayManage.destroy({
        where: {
          id: req.body.id
        }
      })
      res.send({
        code: 200,
        error: '数据删除成功'
      })
    } catch (error) {
      res.send({
        code: 502,
        error: '数据删除失败'
      })
    }
  },
  async updatePayManage(req, res) {
    try {
      await PayManage.update(
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
      console.log(error)
      res.send({
        code: 502,
        error: '数据更新失败'
      })
    }
  },
  async getPayManage(req, res) {
    try {
      const whereOpt = {}
      const { belongType, belongUser, state, deadLine, page=1, limit=10 } = req.body
      if (belongType) {
        whereOpt['belongType'] = belongType
      }
      if (belongUser) {
        whereOpt['belongUser'] = belongUser
      }
      if (state) {
        whereOpt['state'] = state
      }
      if (deadLine) {
        whereOpt['deadLine'] = {[Op.lte]: deadLine}
      }
      const payManage = await PayManage.findAndCountAll({
        where: whereOpt,
        include: [{
          model: User,
          attributes: ['account', 'phoneNumber']
        }, {
          model: PayType,
          attributes: ['name']
        }],
        raw: true, //开始原生查询
        order: [['deadLine', 'DESC']],
        offset: (page - 1)*limit,
        limit
     })
      if (payManage) {
        res.send({
          code: 200,
          payManage
        })
      } else {
        res.send({
          code: 502,
          error: '没有找到对应的数据'
        })
      }
    } catch (error) {
      console.log(error)
      res.status(500).send({
        code: 500,
        error: '数据查询失败'
      })
    }
  }
}