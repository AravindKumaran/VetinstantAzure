const router = require('express').Router()
const {
  saveChat,
  getRoomsChat,
  getSingleChat,
} = require('../controllers/chatCtrl')

const { protect } = require('../middleware/protect')

router.use(protect)

router.post('/', saveChat)

router.get('/:id', getSingleChat)

router.get('/room/:name/:petid', getRoomsChat)

module.exports = router
