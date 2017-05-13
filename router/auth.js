'use strict'

const router = require('express').Router()
const c = require(path.join(BASE_DIR, 'controller/auth'))

router.post('/login', c.login)

module.exports = router
