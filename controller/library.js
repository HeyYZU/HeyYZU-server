'use strict'

const mock = require('./mock.json').library
const readingList = (req, res, next) => {
  res.status(200).json(mock.reading)
}

const readList = (req, res, next) => {
  res.status(200).json(mock.read)
}

const reservingList = (req, res, next) => {
  res.status(200).json(mock.reserving)
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
  res.status(200).json(mock.book)
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
