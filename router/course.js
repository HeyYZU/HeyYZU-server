'use strict'

const router = require('express').Router()
const c = require(path.join(BASE_DIR, 'controller/course'))

router.get('/announcement/:id', c.announcement)
router.get('/announcement/attach/:id', c.announcement.attach)
router.get('/material/:id', c.material)
router.get('/material/attach/:id', c.material.attach)
router.get('/homework/archive/:id', c.homework.archive)
router.get('/homework/attach/:id', c.homework.attach)
router.get('/homework/:id', c.homework)
router.get('/absent/:id', c.absent)

module.exports = router
