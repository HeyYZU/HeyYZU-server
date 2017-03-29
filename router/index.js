const activity = require('./activity')
const calendar = require('./calendar')
const course = require('./course')
const info = require('./info')
const library = require('./library')
const user = require('./user')

var router = require('express').Router()

router.use('/activity', activity)
router.use('/calendar', calendar)
router.use('/course', course)
router.use('/info', info)
router.use('/library', library)
router.use('/user', user)

module.exports = router
