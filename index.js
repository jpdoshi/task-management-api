const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const TaskRoutes = require('./routes/TaskRoutes');
const UserRoutes = require('./routes/UserRoutes');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = `mongodb+srv://jpdoshi2811:${encodeURIComponent(process.env.MONGO_PASS)}@cluster0.pxzycum.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

try {
  mongoose.connect(MONGO_URI, { dbName: 'task_management_api' });
  console.log('Connected to Database!');
} catch (err) {
  console.error('Mongoose Error:', err);
}

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/tasks', TaskRoutes);
app.use('/auth', UserRoutes);
app.use ((req, res) => {
  res.status(404).json({
    statusCode: 404,
    success: false,
    msg: 'Route Not Found!'
  })
});

const http = require('http').Server(app);
const io = require('socket.io')(http);

let onlineUsers = {};

http.listen(PORT, (err) => {
  if (err) { console.error(err); }
  console.log(`App is listening on PORT:${PORT}`);
});

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  onlineUsers[userId] = socket.id;

  socket.on('disconnect', () => {
    delete onlineUsers[userId];
  });
});

app.io = io;
app.onlineUsers = onlineUsers;
