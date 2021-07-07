const { Bulletin, User } = require('../models')
const Sequelize = require(`sequelize`)
const Op = Sequelize.Op

module.exports = {
  async addBulletin(req, res) {
    try {
      const bulletin = await Bulletin.create(req.body)
      res.send({
        code: 200,
        bulletin
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
  async deleteBulletin(req, res) {
    try {
      await Bulletin.destroy({
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
  async updateBulletin(req, res) {
    try {
      await Bulletin.update(
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
  async getBulletin(req, res) {
    try {
      const whereOpt = {}
      const { title, content, state, publishAt, page=1, limit=10 } = req.body
      if (title) {
        whereOpt['title'] = {[Op.like]: '%'+title+'%'}
      }
      if (content) {
        whereOpt['content'] = {[Op.like]: '%'+content+'%'}
      }
      if (state) {
        whereOpt['state'] = state
      }
      if (publishAt) {
        publishAt[1] = new Date(Date.parse(publishAt[1]))
        publishAt[1].setTime(publishAt[1].getTime() + 3600*1000*16)
        whereOpt['publishAt'] = {
          [Op.lte]: publishAt[1],
          [Op.gte]: publishAt[0]
        }
      }
      const bulletin = await Bulletin.findAndCountAll({
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
      if (bulletin) {
        res.send({
          code: 200,
          bulletin
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