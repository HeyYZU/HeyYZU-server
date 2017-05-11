'use strict'

const libraryProxy = require(path.join(BASE_DIR, '/proxy/library'))
const userProxy = require(path.join(BASE_DIR, '/proxy/user'))
const mock = require('./mock.json')
const readingList = (req, res, next) => {
  let token = req.query.access_token
  userProxy.library.reading(token)
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
  let token = req.query.access_token
  const readingBook = userProxy.library.reading(token)
    .then((content) => {
      return {
        key: 'reading',
        package: content
      }
    })

  const reservingBook = userProxy.library.reserving(token).then((content) => {
    return {
      key: 'reserving',
      package: content
    }
  })

  Promise.all([readingBook, reservingBook])
  .then((r) => {
    const readingBook = r.filter((r) => r.key === 'reading')[0].package
    const reservingBook = r.filter((r) => r.key === 'reserving')[0].package

    res.status(200).json({
      reading: {
        count: readingBook.length,
        leastFive: readingBook.slice(0, 5)
      },
      reserving: {
        count: reservingBook.length,
        leastFive: reservingBook.slice(0, 5)
      },
      favorite: {
        count: 0,
        leastFive: []
      }
    })
  })
  .catch((e) => {
    console.log(e)
    res.status(500).json({message: 'Internal Error.'})
  })
}

const bookInfo = (req, res, next) => {
  let bookId = req.params.id
  libraryProxy.book.status(bookId)
      // Following key name of el is from yzu api response
      // In order to offset time zone to UTC, - 28800 for parse result of time
    .then((res) => omitEmpty({
      id: bookId,
      title: res.info.bktitle,
      author: res.info.author,
      index: res.info.callno || '採購或編目中',
      publisher: res.info.Publisher,
      year: parseInt(res.info.publish_YY, 10) || 0,
      isbn: parseInt(res.info.ISBN.replace(/[^0-9]/ig, ''), 10) || null,
      cover: res.info.Cover,
      media: res.info.material_type === '視聽多媒體' || null,
      ebook: res.info.material_type === '電子書' || null,
      collections: res.collections.map((el) => ({
        branch: el.SublibraryC || null,
        collection: el.CollectionC || null,
        reservingCount: el.RequestCount || null,
        return: Math.round(Date.parse(el.RealDueDate) / 1000) - 28800 || null,
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
