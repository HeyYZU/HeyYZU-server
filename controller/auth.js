'use strict'

const authProxy = require(path.join(BASE_DIR, '/proxy/auth'))
const UserModel = require(path.join(BASE_DIR, '/model')).user
const logger = log4js.getLogger('api')

const login = (req, res, next) => {
  let username = req.body.username
  let password = req.body.password

  if (!(typeof username === 'string' && typeof password === 'string')) {
    res.status(401).json({
      message: 'username or password are invalid.'
    })
    return
  }

  authProxy(username, password)
    .then((r) => {
      let context = {}

      if (r.token.length > 0) {
        UserModel.findOneAndUpdate(
          { account: username },
          new UserModel({
            account: username,
            token: r.token,
            meta: {
              leastActive: Date.now()
            }
          }),
          {
            upsert: true,
            new: true,
            runValidators: true
          }
        )
        .catch((err) => {
          logger.error(err)
        })

        context.statusCode = 200
        context.body = {
          token: r.token,
          expired: parseInt(r.expired, 10)
        }
      } else {
        context.statusCode = 401
        context.message = {
          message: 'username or password are invalid'
        }
      }

      return context
    })
    .then((context) => {
      res.status(context.statusCode).json(context.body)
    })
    .catch((err) => {
      if (err.message === 'Username or password is mistake.') {
        res.status(401).json({
          message: 'username or password are invalid.'
        })
      } else {
        res.status(502).json({message: 'Bad Gateway'})
      }
    })
}

module.exports = {
  login: login
}
