const express = require('express');
const mongoose = require('mongoose');

const TaskRoutes = require('./routes/TaskRoutes');

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
app.use('/tasks', TaskRoutes);

app.listen(PORT, (err) => {
  if (err) { console.error(err); }
  console.log(`App is listening on PORT:${PORT}`);
});
