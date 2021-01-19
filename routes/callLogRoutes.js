const router = require('express').Router()

const {
  getAllCallLog,
  saveCallLog,
  updatePending,
} = require('../controllers/callLogCtrl')
const { protect } = require('../middleware/protect')

router.use(protect)

router.route('/').get(getAllCallLog).post(saveCallLog)

router.route('/:id').patch(updatePending)

module.exports = router
