'use strict'

const router = require('express').Router()
const c = require(path.join(BASE_DIR, 'controller/user'))

router.get('/curriculum', c.curriculum)
router.get('/info', c.info)
router.get('/dashboard', c.dashboard)

module.exports = router
