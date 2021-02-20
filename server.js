require('express-async-errors')
require('dotenv').config({ path: './config.env' })
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const http = require('http')
// const http = require('https')
const socketio = require('socket.io')
const axios = require('axios')

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
app.use(express.urlencoded({ extended: true }))
app.use(cors())

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
        // await axios.patch(
        //   `https://vetinstantbe.azurewebsites.net/api/v1/users/userOffline/${onlineUsers[index]}`
        // )
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

// Mounting routes

app.use('/api/v1/auth', require('./routes/authRoutes'))
app.use('/api/v1/users', require('./routes/userRoutes'))
app.use('/api/v1/pets', require('./routes/petRoutes'))
app.use('/api/v1/doctors', require('./routes/doctorRoutes'))
app.use('/api/v1/hospitals', require('./routes/hospitalRoutes'))
app.use('/api/v1/rooms', require('./routes/roomRoutes'))
app.use('/api/v1/chats', require('./routes/chatRoutes'))
app.use('/api/v1/calllogs', require('./routes/callLogRoutes'))
app.use('/api/v1/scheduledCalls', require('./routes/scheduledCallRoutes'))

app.use(errorMid)

const PORT = process.env.PORT || 8000

server.listen(PORT, '192.168.43.242', () =>
  console.log(`Server is running on port ${PORT}`)
)
// server.listen(PORT, 'https://vetinstantbe.azurewebsites.net', () =>
//   console.log(`Server is running on port ${PORT}`)
// )
