const router = require('express').Router()

const {
  saveCallPending,
  getCallPendingByUser,
  updateCallPending,
  getCallPendingByDoctor,
  getSingleCallPending,
  deleteCallPending,
  deleteCallPendingAfter,
} = require('../controllers/callPendingCtrl')

const { protect, authorize } = require('../middleware/protect')

router.use(protect)

router.get('/user/:userId', getCallPendingByUser)
router.get('/doctor/:userId', getCallPendingByDoctor)

router.route('/').post(saveCallPending)

router.delete('/after/:id', deleteCallPendingAfter)

router
  .route('/:id')
  .patch(updateCallPending)
  .get(getSingleCallPending)
  .delete(deleteCallPending)

module.exports = router
