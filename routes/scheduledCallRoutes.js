const router = require('express').Router()
const {
  saveScheduledCall,
  getScByUser,
  getScByUserAndDoc
} = require('../controllers/scheduledCtrl')

const { protect, authorize } = require('../middleware/protect')

router.use(protect)

router
  .route('/')
  .get(authorize('user'), getScByUser)
  .post(authorize('doctor'), saveScheduledCall)

router.route('/:userId/:docId').get(getScByUserAndDoc)

module.exports = router
