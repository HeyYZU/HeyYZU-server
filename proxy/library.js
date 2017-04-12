'use strict'

const request = require('request-promise')
const logger = log4js.getLogger('proxy')

const response = (options) => {
  return request(options).then((res) => {
    return res.body
  }).catch((e) => {
    logger.debug('[library]' + e)
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
  const createPromise = (requestOptions) => {
    return response(requestOptions)
      .then((res) => (
        res[0] === undefined ? createPromise(requestOptions)
          : res[0].Description === undefined ? (res)
          : Promise.reject(new Error('book id invalid.'))
      ), (err) => {
        logger.debug('[bookStatus]Retry - ' + requestOptions.uri)
        return createPromise(requestOptions)
      })
  }

  let content = {}
  return createPromise({
    uri: 'https://unipop.yzu.edu.tw/OpenAPI/api/lib/Holding/' + id,
    resolveWithFullResponse: true,
    json: true
  }).then((res) => {
    content.collections = res
    return createPromise({
      uri: 'https://unipop.yzu.edu.tw/OpenAPI/api/lib/keyword/sys=' + id,
      resolveWithFullResponse: true,
      json: true
    })
  }).then((res) => {
    content.info = res[0]
    return content
  }).catch((e) => {
    if (e.message === 'book id invalid.') e.statusCode = 404
    return Promise.reject(e)
  })
}

const bookInfo = (id) => {
  return response({
    uri: 'https://unipop.yzu.edu.tw/OpenAPI/api/lib/keyword/sys=' + id,
    resolveWithFullResponse: true,
    json: true
  })
}

const bookCollections = (id) => {
  return response({
    uri: 'https://unipop.yzu.edu.tw/OpenAPI/api/lib/Holding/' + id,
    resolveWithFullResponse: true,
    json: true
  })
}

module.exports = {
  search: {
    title: searchByTitle,
    ISBN: searchByISBN
  },
  book: {
    status: bookStatus,
    info: bookInfo,
    collections: bookCollections
  }
}
