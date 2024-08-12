const express = require('express');

const UserController = require('../controllers/UserController');

const UserRoutes = express.Router();

UserRoutes.get('/profile', UserController.getUserProfile);
UserRoutes.post('/login', UserController.loginUser);
UserRoutes.post('/logout', UserController.logoutUser);
UserRoutes.post('/register', UserController.registerUser);

module.exports = UserRoutes;
