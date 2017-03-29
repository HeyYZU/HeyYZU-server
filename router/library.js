const router = require('express').Router()
const c = require(path.join(BASE_DIR, 'controller/library'))

router.get('/reading', c.reading)
router.get('/read', c.read)
router.get('/reserving', c.reserving)
router.get('/favorite', c.getFavorite)
router.put('/favorite', c.putFavorite)
router.delete('/favorite', c.delFavorite)
router.get('/dashboard', c.dashboard)
router.get('/book/:id', c.bookInfo)

module.exports = router
