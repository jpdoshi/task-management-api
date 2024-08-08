const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const TaskRoutes = require('./routes/TaskRoutes');
const UserRoutes = require('./routes/UserRoutes');
const ErrorHandler = require('./middlewares/CustomError');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

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

app.use(ErrorHandler);

const http = require('http').Server(app);
const io = require('socket.io')(http);

http.listen(PORT, (err) => {
  if (err) { console.error(err); }
  console.log(`App is listening on PORT:${PORT}`);
});

io.on('connection', (socket) => {
  console.log(`${socket.id} connected!`);

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected!`);
  });

  socket.on('taskUpdate', () => {
    console.log('Task Updated!');
  });
});

app.io = io;
