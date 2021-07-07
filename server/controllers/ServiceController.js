const { Service, User } = require('../models')
const Sequelize = require(`sequelize`)
const Op = Sequelize.Op

module.exports = {
  async addService(req, res) {
    try {
      const service = await Service.create(req.body)
      res.send({
        code: 200,
        service
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
  async deleteService(req, res) {
    try {
      await Service.destroy({
        where: {
          id: req.query.id
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
  async updateService(req, res) {
    try {
      await Service.update(
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
  async getService(req, res) {
    try {
      const whereOpt = {}
      const { content, createUser, state, createdAt, page=1, limit=10 } = req.body
      if (content) {
        whereOpt['content'] = {[Op.like]: '%'+content+'%'}
      }
      if (createUser) {
        whereOpt['createUser'] = createUser
      }
      if (state) {
        whereOpt['state'] = state
      }
      if (createdAt) {
        createdAt[1] = new Date(Date.parse(createdAt[1]))
        createdAt[1].setTime(createdAt[1].getTime() + 3600*1000*16)
        whereOpt['createdAt'] = {
          [Op.lte]: createdAt[1],
          [Op.gte]: createdAt[0]
        }
      }
      const service = await Service.findAndCountAll({
        where: whereOpt,
        include: [{
          model: User,
          attributes: ['account']
        }],
        raw: true, //开始原生查询
        order: [['createdAt', 'DESC']],
        offset: (page - 1)*limit,
        limit
     })
      if (service) {
        res.send({
          code: 200,
          service
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