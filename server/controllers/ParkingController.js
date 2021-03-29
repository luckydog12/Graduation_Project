const { Parking, User } = require('../models')

module.exports = {
  async addParking(req, res) {
    try {
      const parking = await Parking.create(req.body)
      res.send({
        code: 200,
        parking
      })
    } catch (error) {
      console.log('error',error)
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
  async deleteParking(req, res) {
    try {
      await Parking.destroy({
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
  async updateParking(req, res) {
    try {
      await Parking.update(
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
  async getParking(req, res) {
    try {
      const whereOpt = {}
      const { name, state, type, page=1, limit=10, belongUser } = req.body
      if (name) {
        whereOpt['name'] = name
      }
      if (belongUser) {
        whereOpt['belongUser'] = belongUser
      }
      if (state) {
        whereOpt['state'] = state
      }
      if (type) {
        whereOpt['type'] = type
      }
      const parking = await Parking.findAndCountAll({
        where: whereOpt,
        include: [{
          model: User,
          attributes: ['account']
        }],
        raw: true, //开始原生查询
        offset: (page - 1)*limit,
        limit
     })
      if (parking) {
        res.send({
          code: 200,
          parking
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