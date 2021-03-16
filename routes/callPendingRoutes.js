const router = require('express').Router()

const {
  saveCallPending,
  getCallPendingByUser,
  updateCallPending,
  getCallPendingByDoctor,
} = require('../controllers/callPendingCtrl')

const { protect, authorize } = require('../middleware/protect')

router.use(protect)

router.get('/user/:userId', getCallPendingByUser)
router.get('/doctor/:userId', getCallPendingByDoctor)

router.route('/').post(saveCallPending)

router.route('/:id').patch(updateCallPending)

module.exports = router
