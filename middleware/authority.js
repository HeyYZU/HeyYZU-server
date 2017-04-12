'use strict'

const userProxy = require(path.join(BASE_DIR, 'proxy/user'))

module.exports = (req, res, next) => {
  new Promise((resolve, reject) => {
    if (req.query.access_token === undefined) return reject(new Error('token undefined'))
    return resolve()
  })
  .then(() => {
    return userProxy.library.reserving(req.query.access_token).then(() => {
      return Promise.resolve()
    })
  })
  .then(() => {
    next()
  })
  .catch((e) => {
    res.status(400).json({
      message: 'Token invalid'
    })
  })
}
