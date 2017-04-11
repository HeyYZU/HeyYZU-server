'use strict'

const router = require('express').Router()
const c = require(path.join(BASE_DIR, 'controller/calendar'))

router.get('/list', c.list)
router.get('/event/:id', c.getEvent)
router.put('/event', c.putEvent)
router.delete('/event/:id', c.delEvent)

module.exports = router
