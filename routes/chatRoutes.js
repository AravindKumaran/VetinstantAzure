const router = require('express').Router()
const { saveChat, getRoomsChat } = require('../controllers/chatCtrl')

const { protect } = require('../middleware/protect')

router.use(protect)

router.post('/', saveChat)

router.get('/room/:name/:petid', getRoomsChat)

module.exports = router
