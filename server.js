require("express-async-errors");
require("dotenv").config({ path: "./config.env" });
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const http = require("http");
// const http = require('https')
const socketio = require("socket.io");
const axios = require("axios");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const app = express();

const errorMid = require("./middleware/errorMid");

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => console.log(`Database Connected at ${con.connection.host}`))
  .catch((err) => console.log(err));

// mongoose.connect(process.env.MONGO_URL, {
//   useNewUrlParser: true,
//   ssl: true,
//   sslValidate: false,
//   sslCA: fs.readFileSync('./rds-combined-ca-bundle.pem')})
// .then(() => console.log('Connection to DB successful'))
// .catch((err) => console.error(err,'Error'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
});

app.use(limiter);

// Socket

const server = http.createServer(app);

const io = socketio(server).sockets;
const onlineUsers = [];
const listOfUsers = [];
io.on("connection", function (socket) {
  socket.on("online", (data) => {
    if (!onlineUsers.includes(data)) {
      onlineUsers.push(data);
      listOfUsers.push({ data, id: socket.id });
      console.log("Online", onlineUsers);
      console.log("List Online", listOfUsers);
    }
  });

  socket.on("room", (room) => {
    socket.join(room);
  });

  socket.on("chat", (data) => {
    const { room, msg } = data;
    io.to(room).emit("chat", msg);
  });

  socket.on("videoCall", (data) => {
    io.emit("videoCall", data);
  });

  // socket.on('pendingCall', (data) => {
  //   console.log('Data', data)
  //   io.emit('pendingCall', data)
  // })

  socket.on("disconnect", async () => {
    try {
      const index = listOfUsers.findIndex((user) => user.id === socket.id);
      if (index !== -1) {
        // await axios.patch(
        //   `http://192.168.43.242:8000/api/v1/users/userOffline/${onlineUsers[index]}`
        // )
        await axios.patch(
          `https://vetinstantbe.azurewebsites.net/api/v1/users/userOffline/${onlineUsers[index]}`
        );
        onlineUsers.splice(index, 1);
        listOfUsers.splice(index, 1);
        console.log("Online", onlineUsers);
        console.log("List Online", listOfUsers);
      }
    } catch (err) {
      console.log("Error", err);
    }
    console.log("A user has left!");
  });
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("tiny"));
}

// const logs = fs.createWriteStream(path.join(__dirname, 'logs.log'), {
//   flags: 'a',
// })

// app.use(morgan('combined', { stream: logs }))

app.use(express.static(path.join(__dirname, "public/uploads")));

// Mounting routes

app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/users", require("./routes/userRoutes"));
app.use("/api/v1/pets", require("./routes/petRoutes"));
app.use("/api/v1/doctors", require("./routes/doctorRoutes"));
app.use("/api/v1/hospitals", require("./routes/hospitalRoutes"));
app.use("/api/v1/rooms", require("./routes/roomRoutes"));
app.use("/api/v1/chats", require("./routes/chatRoutes"));
app.use("/api/v1/calllogs", require("./routes/callLogRoutes"));
app.use("/api/v1/scheduledCalls", require("./routes/scheduledCallRoutes"));
app.use("/api/v1/pendingcalls", require("./routes/callPendingRoutes"));

app.use(errorMid);

app.get("/", (req, res) => {
  res.send("Hi there! Welcome to Vetinstance App!");
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, "192.168.1.46", () =>
  console.log(`Server is running on port ${PORT}`)
);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
