require('express-async-errors')
require('dotenv').config({ path: './config.env' })
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const axios = require('axios')
const twilio = require('twilio')

const app = express()

const errorMid = require('./middleware/errorMid')

mongoose
  .connect(process.env.LOCAL_MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => console.log(`Database Connected at ${con.connection.host}`))
  .catch((err) => console.log(err))

app.use(express.json())

// Socket

const server = http.createServer(app)

const io = socketio(server).sockets
const onlineUsers = []
const listOfUsers = []
io.on('connection', function (socket) {
  socket.on('online', (data) => {
    if (!onlineUsers.includes(data)) {
      onlineUsers.push(data)
      listOfUsers.push({ data, id: socket.id })
      console.log('Online', onlineUsers)
      console.log('List Online', listOfUsers)
    }
  })

  socket.on('room', (room) => {
    socket.join(room)
  })

  socket.on('chat', (data) => {
    const { room, msg } = data
    io.to(room).emit('chat', msg)
  })

  socket.on('disconnect', async () => {
    try {
      const index = listOfUsers.findIndex((user) => user.id === socket.id)
      if (index !== -1) {
        await axios.patch(
          `http://192.168.43.242:8000/api/v1/users/userOffline/${onlineUsers[index]}`
        )
        onlineUsers.splice(index, 1)
        listOfUsers.splice(index, 1)
        console.log('Online', onlineUsers)
        console.log('List Online', listOfUsers)
      }
    } catch (err) {
      console.log('Error', err)
    }
    console.log('A user has left!')
  })
})

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'))
}

app.use(express.static(path.join(__dirname, 'public/uploads')))

app.use(cors())

// Mounting routes

app.use('/api/v1/auth', require('./routes/authRoutes'))
app.use('/api/v1/users', require('./routes/userRoutes'))
app.use('/api/v1/pets', require('./routes/petRoutes'))
app.use('/api/v1/doctors', require('./routes/doctorRoutes'))
app.use('/api/v1/hospitals', require('./routes/hospitalRoutes'))
app.use('/api/v1/rooms', require('./routes/roomRoutes'))
app.use('/api/v1/chats', require('./routes/chatRoutes'))

const AccessToken = twilio.jwt.AccessToken
const VideoGrant = AccessToken.VideoGrant

app.get('/api/v1/users/getToken', (req, res) => {
  if (!req.query || !req.query.userName) {
    return res.status(400).send('Username parameter is required')
  }
  const accessToken = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_KEY_SID,
    process.env.TWILIO_KEY_SECRET
  )

  // Set the Identity of this token
  accessToken.identity = req.query.userName

  // Grant access to Video
  const grant = new VideoGrant({
    room: 'home',
  })
  accessToken.addGrant(grant)

  // Serialize the token as a JWT
  const jwt = accessToken.toJwt()
  console.log(accessToken, jwt)
  return res.send(jwt)
})

app.use(errorMid)

const PORT = process.env.PORT || 8000

server.listen(PORT, '192.168.43.242', () =>
  console.log(`Server is running on port ${PORT}`)
)
