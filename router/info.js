'use strict'

const router = require('express').Router()
const path = require('path')
const c = require(path.join(BASE_DIR, 'controller/info'))

router.get('/sysInfo', c.sysInfo)
router.get('/app/android', c.androidInfo)
router.get('/app/ios', c.iosInfo)

module.exports = router
