'use strict'

const router = require('express').Router()
const c = require(path.join(BASE_DIR, 'controller/activity'))

router.get('/list', c.list)

module.exports = router
