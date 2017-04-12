'use strict'

const activity = require('./activity')
const calendar = require('./calendar')
const course = require('./course')
const info = require('./info')
const library = require('./library')
const user = require('./user')

var router = require('express').Router()
const middleware = require(path.join(BASE_DIR, 'middleware'))

router.use('/activity', middleware.authority, activity)
router.use('/calendar', middleware.authority, calendar)
router.use('/course', middleware.authority, course)
router.use('/info', info)
router.use('/library', middleware.authority, library)
router.use('/user', middleware.authority, user)

module.exports = router
