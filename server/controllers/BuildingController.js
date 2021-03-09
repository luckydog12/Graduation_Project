const { Building } = require('../models')
const Sequelize = require(`sequelize`)
const Op = Sequelize.Op

module.exports = {
  async addBuilding(req, res) {
    try {
      const building = await Building.create(req.body)
      res.status(200).send({
        code: 200,
        building
      })
    } catch (error) {
      console.log(error)
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
  async deleteBuilding(req, res) {
    try {
      const id = req.body.id
      const building = await Building.findByPk(id)
      if (building) {
        try {
          await Building.destroy({
            where: {
              id
            }
          })
          res.status(200).send({
            code: 200,
            error: '数据删除成功'
          })
        } catch (error) {
          res.status(502).send({
            code: 502,
            error: '数据删除失败'
          })
        }
      } else {
        res.status(502).send({
          code: 502,
          error: '没有找到对应的数据'
        })
      }
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据库中没有对应的数据，删除失败'
      })
    }
  },
  async updateBuildling(req, res) {
    try {
      await Building.update(
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
  async getBuildingNameAll(req, res) {
    try {
      const building = await Building.findAll({
        attributes: [['name', 'value']] //别名
      })
      if (building) {
        res.status(201).send({
          building 
        })
      } else {
        res.status(502).send({
          code: 502,
          error: '没有找到对应的数据'
        })
      }
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据查询失败'
      })
    }
  },
  async getBuilding(req, res) {
    try {
      const { name, page=1, limit=10 } = req.body
      const building = await Building.findAndCountAll({
        where: {
           name: {
             [Op.like]: '%'+name+'%'
           }
        },
        offset: (page - 1)*limit,
        limit
     })
      if (building) {
        res.status(201).send({
          building
        })
      } else {
        res.status(502).send({
          code: 502,
          error: '没有找到对应的数据'
        })
      }
    } catch (error) {
      res.status(500).send({
        code: 500,
        error: '数据查询失败'
      })
    }
  }
}