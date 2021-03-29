const {
  User
} = require('../models')
const config = require('../config')
const Jwt = require('jsonwebtoken')
const Sequelize = require(`sequelize`)
const Op = Sequelize.Op

function tokenSign({
  id,
  account
}) {
  try {
    //sign生成token
    return Jwt.sign({
      id,
      account
    }, config.token.secretOrPrivateKey, config.token.options)
  } catch (error) {
    throw (error)
  }
}

module.exports = {
  async register(req, res) {
    try {
      const user = await User.create(req.body)
      res.status(200).send({
        code: 200,
        user,
        token: tokenSign(user)
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
  async deleteUser(req, res) {
    try {
      await User.destroy({
        where: {
          id: req.body.id
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
  },
  async updateUser(req, res) {
    try {
      await User.update(
        req.body, {
          where: {
            id: req.query.id
          }
        }
      )
      res.status(200).send({
        code: 200,
        message: '数据更新成功'
      })
    } catch (error) {
      console.log(error)
      res.status(502).send({
        code: 502,
        error: '数据更新失败'
      })
    }
  },
  async getUsersAll(req, res) {
    try {
      const {  page=1, limit, sex, identity, account, name, id } = req.body
      const whereOpt = {}
      if (sex) {
        whereOpt['sex'] = sex
      }
      if (id) {
        whereOpt['id'] = id
      }
      if (identity) {
        whereOpt['identity'] = identity
      }
      if (account) {
        whereOpt['account'] = {
          [Op.like]: '%'+account+'%'
        }
      }
      if (name) {
        whereOpt['name'] = {
          [Op.like]: '%'+name+'%'
        }
      }
      const user = await User.findAndCountAll({
        attributes: ['id','account', 'name', 'phoneNumber', 'age', 'sex', 'identity', 'createdAt'],
        where: whereOpt,
        offset: (page - 1)*limit,
        limit
      })
      if (user) {
        res.status(200).send({
          code: 200,
          user
        })
      } else {
        res.status(502).send({
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
  async getUserAccount(req, res) {
    try {
      const userAccount = await User.findAll({
        attributes: [['account', 'value']] //别名
      })
      if (userAccount) {
        res.status(200).send({
          code: 200,
          userAccount 
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
  async getUserName(req, res) {
    try {
      const userName = await User.findAll({
        where: {
          name: {
            [Op.not]: null
          }
        },
        attributes: [['name', 'value']] //别名
      })
      if (userName) {
        res.status(200).send({
          code: 200,
          userName 
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
  async login(req, res) {
    try {
      const user = await User.findOne({
        where: {
          account: req.body.account
        }
      })
      let isVaildInfo = user.compareInfo(req.body.password, req.body.identity)
      if (isVaildInfo) {
        if (user.identity === 1) {
          res.send({
            code: 200,
            user: {
              id: user.id,
              account: user.account,
              identity: user.identity,
              routeInfo: [{
                path: '/layout',
                name: 'Layout',
                component: 'layout/index',
                children: [{
                  path: '/admin/home',
                  name: '首页',
                  component: "admin/home/home"
                }, {
                  path: "/houseSys",
                  name: "房屋系统",
                  children: [{
                    path: "/building",
                    name: "楼栋管理",
                    component: "admin/house/building"
                  }, {
                    path: "/house",
                    name: "房屋管理",
                    component: "admin/house/house"
                  }]
                  }, {
                    path: '/parkingSys',
                    name: '车位系统',
                    children: [{
                      path: '/parking',
                      name: '车位管理',
                      component: "admin/parking/parking"
                    }]
                  }, {
                    path: '/paymentSys',
                    name: '缴费系统',
                    children: [{
                      path: '/payManage',
                      name: '缴费管理',
                      component: "admin/payment/payMange"
                    }]
                  }, {
                    path: '/communitySys',
                    name: '社区服务',
                    children: [{
                      path: '/bulletin',
                      name: '公告管理',
                      component: "admin/community/bulletin"
                    }, {
                      path: '/service',
                      name: '维修/投诉管理',
                      component: "admin/community/service"
                    },
                    // {
                    //   path: '/complaint',
                    //   name: '投诉管理',
                    //   component: "admin/community/complaint"
                    // }
                  ]
                  }, {
                    path: '/userSys',
                    name: '用户系统',
                    children: [{
                      path: '/user',
                      name: '用户管理',
                      component: "admin/user/admin"
                    }]
                  }]
              }]
            },
            token: tokenSign(user),
            message: '登录成功',
          })
        } else {
          res.send({
            code: 200,
            user: {
              id: user.id,
              account: user.account,
              identity: user.identity,
              routeInfo: [{
                path: '/layout',
                name: 'Layout',
                component: 'layout/index',
                children: [{
                  path: '/owner/home',
                  name: '首页',
                  component: "owner/home"
                }, {
                  path: '/bulletin',
                  name: '查看公告',
                  component: "owner/bulletin"
                }, {
                  path: '/service',
                  name: '我的投诉/报修',
                  component: "owner/service"
                }, 
                // {
                //   path: '/service',
                //   name: '我的报修',
                //   component: "owner/service"
                // }, 
                {
                  path: '/payment',
                  name: '我的账单',
                  component: "owner/payment"
                }]
              }],
            },
            token: tokenSign(user),
            message: '登录成功',
          })
        }
      } else {
        res.send({
          code: 502,
          error: '密码错误或身份错误'
        })
      }
    } catch (error) {
      console.log(error)
      res.send({
        code: 502,
        error: '登录信息错误'
      })
    }
  },
  async comparePwd(req, res) {
    try {
      const pwd = await User.findByPk(req.query.id)
      if (pwd.password == req.body.oldPwd) {
        res.send({
          code: 200,
          result: 1 //相同
        })
      } else {
        res.send({
          code: 200,
          result: 2 //相同
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
}