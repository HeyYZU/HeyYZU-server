'use strict'

const mock = require('./mock.json').user
const curriculum = (req, res, next) => {
  res.status(200).json(mock.curriculum)
}

const info = (req, res, next) => {
  res.status(mock.info.status).json({ message: mock.info.message })
}

const dashboard = (req, res, next) => {
  res.status(mock.dashboard.status).json({ message: mock.dashboard.message })
}

module.exports = {
  curriculum: curriculum,
  info: info,
  dashboard: dashboard
}
