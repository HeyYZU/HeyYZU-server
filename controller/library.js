'use strict'

const libraryProxy = require(path.join(BASE_DIR, '/proxy/library'))
const userProxy = require(path.join(BASE_DIR, '/proxy/user'))
const readingList = (req, res, next) => {
  let token = req.query.access_token
  userProxy.library.reading(token)
    .then((res) => {
      // Following key name of el is from yzu api response
      // In order to offset time zone to UTC, - 28800 for parse result of time
      return res.map((el) => omitEmpty({
        id: parseInt(el.Bibliosno, 10),
        title: el.bktitle,
        author: el.author,
        attr: {
          dueDate: Math.round(Date.parse(el.ReadDueDate) / 1000) - 28800,
          fine: el.Fine > 0 ? el.Fine : null,
          renewable: el.MaxRenewTimes > 0,
          reserved: Math.round(Date.parse(el.RecallDate) / 1000) - 2880 <= 0
        }
      }))
    })
    .then((content) => {
      res.status(200).json(content)
    })
    .catch((e) => {
      res.status(502).json({message: 'Bad Gateway'})
    })
}

const readList = (req, res, next) => {
  let token = req.query.access_token
  userProxy.library.read(token)
    .then((res) => {
      // Following key name of el is from yzu api response
      // In order to offset time zone to UTC, - 28800 for parse result of time
      return res.map((el) => ({
        id: parseInt(el.Bibliosno, 10),
        title: el.bktitle,
        author: el.author
      }))
    })
    .then((content) => {
      return Promise.all(
          content.map(el => libraryProxy.book.status(el.id))
        )
        .then((res) => {
          return content.map(el => {
            let book = res.find(book => parseInt(book.info.bibliosno, 10) === el.id)
            return {
              id: el.id,
              title: el.title,
              author: el.author,
              attr: {
                index: book.info.callno,
                reserved: book.collections.reduce((pv, el) => pv + el.RequestCount, 0)
              }
            }
          })
        })
    })
    .then((content) => {
      res.status(200).json(content)
    })
    .catch((e) => {
      res.status(502).json({message: 'Bad Gateway'})
    })
}

const reservingList = (req, res, next) => {
  let token = req.query.access_token
  userProxy.library.reserving(token)
    .then((res) => {
      // Following key name of el is from yzu api response
      // In order to offset time zone to UTC, - 28800 for parse result of time
      return res.map((el) => omitEmpty({
        id: el.bibliosno,
        title: el.bktitle,
        author: el.author,
        attr: {
          order: el.OrderSNo,
          reservedBefore: el.OrderSNo === 1 ? Math.round(Date.parse(el.HoldDeadLine) / 1000) - 2880 : null
        }
      }))
    })
    .then((content) => {
      res.status(200).json(content)
    })
    .catch((e) => {
      res.status(502).json({message: 'Bad Gateway'})
    })
}

const favoriteList = (req, res, next) => {
  res.status(200).json(mock.favorite)
}

const putFavorite = (req, res, next) => {
  res.status(mock.favoriteAction.putFavorite.status).json({ message: mock.favoriteAction.putFavorite.message })
}

const delFavorite = (req, res, next) => {
  res.status(mock.favoriteAction.delFavorite.status).json({ message: mock.favoriteAction.delFavorite.message })
}

const dashboard = (req, res, next) => {
  res.status(200).json(mock.dashboard)
}

const bookInfo = (req, res, next) => {
  let bookId = req.params.id
  libraryProxy.book.status(bookId)
      // Following key name of el is from yzu api response
    .then((res) => omitEmpty({
      title: res.info.bktitle,
      author: res.info.author,
      index: res.info.callno || '採購或編目中',
      publisher: res.info.Publisher,
      year: res.info.publish_YY,
      isbn: parseInt(res.info.ISBN.replace(/[^0-9]/ig, ''), 10) || null,
      cover: res.info.Cover,
      media: res.info.material_type === '視聽多媒體' || null,
      ebook: res.info.material_type === '電子書' || null,
      collections: res.collections.map((el) => ({
        branch: el.SublibraryC || null,
        collection: el.CollectionC || null,
        reservingCount: el.RequestCount || null,
        return: Math.round(Date.parse(el.RealDueDate) / 1000) - 2880 || null,
        attr: {
          type: el.MaterialType || null
        }
      }))
    }))
    .then((content) => {
      res.status(200).json(content)
    })
    .catch((e) => {
      switch (e.statusCode) {
        case 404:
          res.status(404).json({message: 'Not Found'})
          break
        default:
          res.status(502).json({message: 'Bad Gateway'})
          break
      }
    })
}

module.exports = {
  reading: readingList,
  read: readList,
  reserving: reservingList,
  getFavorite: favoriteList,
  putFavorite: putFavorite,
  delFavorite: delFavorite,
  dashboard: dashboard,
  bookInfo: bookInfo
}
