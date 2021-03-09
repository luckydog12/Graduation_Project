const { House, User } = require('../models')

module.exports = {
  async addHouse(req, res) {
    try {
      const house = await House.create(req.body)
      res.send({
        code: 200,
        house
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
  async deleteHouse(req, res) {
    try {
      await House.destroy({
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
  async updateHouse(req, res) {
    try {
      await House.update(
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
  async getHouse(req, res) {
    try {
      const { state, page=1, limit=10 } = req.body
      const house = await House.findAndCountAll({
        where: {
           state
        },
        include: [{
          model: User
        }],
        raw: true, //开始原生查询
        offset: (page - 1)*limit,
        limit
     })
      if (house) {
        res.send({
          code: 200,
          house
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
  },
  async getHouseAll(req, res) {
    try {
      const house = await House.findAll({
        include: [{
          model: User
        }],
      })
      if (house) {
        res.send({
          code: 200,
          house
        })
      } else {
        res.send({
          code: 502,
          error: '没有找到对应的数据'
        })
      }
    } catch (error) {
      console.log(error)
      res.send({
        code: 500,
        error: '数据查询失败'
      })
    }
  }
}