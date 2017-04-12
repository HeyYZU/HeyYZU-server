'use strict'

const request = require('request-promise')
const ursa = require('ursa')
const config = CONFIG.YZU_API
const logger = log4js.getLogger('proxy')

const getRSAKey = () => {
  let options = {
    method: 'POST',
    uri: 'https://unipop.yzu.edu.tw/YzuPortalAPI/api/Auth/RSAkeybyAppID',
    headers: {
      'Authorization': 'Basic ' + new Buffer(config.secret.username + ':' + config.secret.password).toString('base64')
    },
    form: {
      'AppID': config.appID
    },
    resolveWithFullResponse: true,
    json: true
  }
  return request(options).then((res) => {
    return res.body
  })
}

const auth = (username, password) => {
  if (!username || !password) {
    return Promise.reject(new Error('Must give username and password'))
  }

  let prepareKey = (keyInfo) => {
    return ursa.createPublicKeyFromComponents(
      Buffer.from(keyInfo.Modulus, 'base64'), Buffer.from(keyInfo.Exponent, 'base64')
    )
  }

  let genCipher = (key) => {
    return {
      account: key.encrypt(username, 'utf8', 'base64', ursa.RSA_PKCS1_PADDING),
      password: key.encrypt(password, 'utf8', 'base64', ursa.RSA_PKCS1_PADDING)
    }
  }

  let prepareReq = (cipher) => {
    let options = {
      method: 'POST',
      uri: 'https://unipop.yzu.edu.tw/YzuPortalAPI/api/Auth/UserAccessToken',
      headers: {
        'Authorization': 'Basic ' + new Buffer(config.secret.username + ':' + config.secret.password).toString('base64')
      },
      form: {
        'AppID': config.appID,
        'account': cipher.account,
        'password': cipher.password
      },
      resolveWithFullResponse: true,
      json: true
    }
    return request(options)
  }

  let processRes = (res) => {
    if (res.body.Token.length === 0 || res.body.DeadLine.length === 0) {
      return Promise.reject(new Error('Username or password is mistake.'))
    }
    return res.body
  }

  return getRSAKey()
    .then(prepareKey)
    .then(genCipher)
    .then(prepareReq)
    .then(processRes)
    .then((res) => ({ token: res.Token, expired: res.DeadLine }))
    .catch((e) => {
      logger.debug('[auth]' + e)
      return Promise.reject(e)
    })
}

module.exports = auth
