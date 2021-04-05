const { messaging } = require('../firebaseInit')

module.exports.sendNotificationToClient = (token, data) => {
  // console.log('Token', token)
  const message = {
    data,
    token: token,
  }
  messaging
    .send(message)
    .then((response) => {
      console.log('Successfully sent message:', response)
    })
    .catch((error) => {
      console.log('Error sending message:', error)
    })
}
