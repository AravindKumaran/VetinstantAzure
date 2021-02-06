const router = require('express').Router()
const {
  saveScheduledCall,
  getScByUser,
} = require('../controllers/scheduledCtrl')

const { protect, authorize } = require('../middleware/protect')

router.use(protect)

router
  .route('/')
  .get(authorize('user'), getScByUser)
  .post(authorize('doctor'), saveScheduledCall)

module.exports = router
