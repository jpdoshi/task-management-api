const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/UserModel');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    bcrypt.hash(password, 10)
      .then(async (hashed) => {
        await UserModel
          .create({
            name, email, password: hashed
          })
          .then((user) => {
            const maxAge = 2 * 60 * 60; // 2 hr
            
            const token = jwt.sign({
              _id: user._id,
              name: user.name,
              email: user.email,
            }, JWT_SECRET, {
              expiresIn: maxAge
            });

            res.cookie('jwt', token, {
              httpOnly: true,
              maxAge: maxAge * 1000
            });

            res.status(201).json(user);
          })
          .catch((err) => {
            res.status(400).send(err);
          });
    });
  } catch (err) {
    next(err);
  }
}

const loginUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await UserModel.findOne({ name, email });

    if (!user) {
      res.status(404).send('User Not Found!');
    } else {
      bcrypt.compare(password, user.password)
        .then((result) => {
          if (result) {
            const maxAge = 2 * 60 * 60; // 2 hr
            
            const token = jwt.sign({
              _id: user._id,
              name: user.name,
              email: user.email
            }, JWT_SECRET, {
              expiresIn: maxAge
            });

            res.cookie('jwt', token, {
              httpOnly: true,
              maxAge: maxAge * 1000
            });

            res.json({'msg': "login successful", user});
          } else {
              res.status(400).send('Could Not Login!');
          }
        });
    }
  } catch (err) {
    next(err);
  }
}

const getUserProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await UserModel.findOne({ name, email });

    if (!user) {
      res.status(404).send('User Not Found!');
    } else {
      bcrypt.compare(password, user.password)
        .then((result) => {
          if (result) {
            const maxAge = 2 * 60 * 60; // 2 hr
            
            const token = jwt.sign({
              _id: user._id,
              name: user.name,
              email: user.email
            }, JWT_SECRET, {
              expiresIn: maxAge
            });

            res.cookie('jwt', token, {
              httpOnly: true,
              maxAge: maxAge * 1000
            });

            res.json(user);
          } else {
            res.status(400).send('User Not Found!');
          }
        });
    }
  } catch (err) {
    next(err);
  }
}

const UserController = {
  loginUser,
  registerUser,
  getUserProfile
};

module.exports = UserController;