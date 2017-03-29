const mock = require('./mock.json').course
const announcement = (req, res, next) => {
  res.status(200).json(mock.announcement)
}

announcement.attach = (req, res, next) => {
  res.status(200).send(mock.attach)
}

const material = (req, res, next) => {
  res.status(200).json(mock.material)
}

material.attach = (req, res, next) => {
  res.status(200).send(mock.attach)
}

const homework = (req, res, next) => {
  res.status(200).json(mock.homework)
}

homework.archive = (req, res, next) => {
  res.status(200).send(mock.archive)
}

homework.attach = (req, res, next) => {
  res.status(200).send(mock.attach)
}

const absent = (req, res, next) => {
  res.status(mock.absent.status).json({ message: mock.absent.message })
}

module.exports = {
  announcement: announcement,
  material: material,
  homework: homework,
  absent: absent
}
