const router = require('express').Router()
const {
  saveChat,
  getRoomsChat,
  getSingleChat,
  uploadMultipleFiles
} = require('../controllers/chatCtrl')

const { protect } = require('../middleware/protect')

router.use(protect)

// router.post('/', saveChat)
router.route('/').post(uploadMultipleFiles, saveChat)

router.get('/:id', getSingleChat)

router.get('/room/:name/:petid', getRoomsChat)

module.exports = router
