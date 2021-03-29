const Jwt = require('jsonwebtoken')
const config = require('../config')

function tokenVerify(token) {
    try {
        //verify验证token
        Jwt.verify(token, config.token.secretOrPrivateKey)
        return true
    } catch(error) {
        return false
    }
}

module.exports = {
    isValidToken(req, res, next) {
        let bearerToken = req.headers.authorization
        // console.log('###########',bearerToken)
        try {
            let token = bearerToken.split(' ')[1]
            // token = token.slice(0, -5)
            console.log('token',token)
            if(tokenVerify(token)) {
                next()
            } else {
                res.status(403).send({
                    code: 403,
                    error: '登录验证无效，请重新登录'
                })
            }
        } catch(error) {
            res.status(401).send({
                status: 401,
                error: '请登录后再访问'
            })
        }
    }
}