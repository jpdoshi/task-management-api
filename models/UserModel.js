const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  }
}, {
  timestamps: true
});

const UserModel = mongoose.model('User', userSchema, 'users');
module.exports = UserModel;
