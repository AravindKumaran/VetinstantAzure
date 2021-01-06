const router = require('express').Router()

const { createRoom, getReceiverRoom } = require('../controllers/roomCtrl')
const { protect } = require('../middleware/protect')

router.use(protect)

router.post('/', createRoom)
router.get('/receiver/:id', getReceiverRoom)

module.exports = router
