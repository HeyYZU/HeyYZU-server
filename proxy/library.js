'use strict'

const request = require('request-promise')
const logger = log4js.getLogger('proxy')

const response = (options) => {
  return request(options).then((res) => {
    return res.body
  }).catch((e) => {
    logger.error('[library]' + e)
    return Promise.reject(e)
  })
}

const searchByTitle = (keyword) => {
  return response({
    uri: 'https://unipop.yzu.edu.tw/OpenAPI/api/lib/keyword/title=' + encodeURIComponent(keyword),
    resolveWithFullResponse: true,
    json: true
  })
}

const searchByISBN = (ISBN) => {
  return response({
    uri: 'https://unipop.yzu.edu.tw/OpenAPI/api/lib/keyword/isbn=' + ISBN,
    resolveWithFullResponse: true,
    json: true
  })
}

const bookStatus = (id) => {
  const createPromise = (key, requestOptions) => {
    return response(requestOptions)
      .then((res) =>
        res[0] === undefined ? Promise.reject(new Error('response is empty.')) : ({key: key, res})
      )
      .catch((err) => {
        logger.info('[bookStatus]Retry - ' + requestOptions.uri)
        return createPromise(key, requestOptions)
      })
  }

  return Promise.all([
    createPromise('info', {
      uri: 'https://unipop.yzu.edu.tw/OpenAPI/api/lib/keyword/sys=' + id,
      resolveWithFullResponse: true,
      json: true
    }),
    createPromise('collections', {
      uri: 'https://unipop.yzu.edu.tw/OpenAPI/api/lib/Holding/' + id,
      resolveWithFullResponse: true,
      json: true
    })
  ]).then((res) => res.reduce((pv, el) => {
    pv[el.key] = el.key === 'info' ? el.res[0] : el.res
    return pv
  }, {}))
  .catch((e) => {
    return Promise.reject(e)
  })
}

module.exports = {
  search: {
    title: searchByTitle,
    ISBN: searchByISBN
  },
  status: bookStatus
}
