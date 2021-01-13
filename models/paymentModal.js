const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
  },
  payment_id: {
    type: String,
    required: true,
  },
  order_id: {
    type: String,
    required: true,
  },
  order_id: {
    type: String,
    required: true,
  },
  order_id: {
    type: String,
    required: true,
  },
  order_id: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Payment', paymentSchema)
