require('express-async-errors')
require('dotenv').config({ path: './config.env' })
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')

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

const app = express()
app.use(express.json())

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

app.use(errorMid)

const PORT = process.env.PORT || 8000

app.listen(PORT, '192.168.43.242', () =>
  console.log(`Server is running on port ${PORT}`)
)
