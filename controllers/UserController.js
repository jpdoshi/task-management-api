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
            res.status(201).json({
              statusCode: 201,
              success: true,
              data: user
            });
          })
          .catch((error) => {
            res.status(400).send({
              statusCode: 400,
              success: false,
              error
            });
          });
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      error
    });
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(404).send({
        statusCode: 404,
        success: false,
        error: 'User Not Found!'
      });
    } else {
      bcrypt.compare(password, user.password)
        .then((result) => {
          if (result && !req.cookies['jwt']) {
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

            res.json({
              statusCode: 200,
              success: true,
              data: 'Login Success!'
            });
          } else {
              res.status(400).json({
                statusCode: 400,
                success: false,
                error: 'Could Not Login!'
              });
          }
        });
    }
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      error
    });
  }
}

const getUserProfile = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(404).json({
        statusCode: 404,
        success: false,
        error:'User Not Found!'
      });
    } else {
      res.json({
        statusCode: 200,
        success: true,
        data: {
          name: user.name,
          email: user.email
        }
      })
    }
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      error
    });
  }
}

const logoutUser = (req, res) => {
  if (req.cookies['jwt']) {
    res.clearCookie('jwt')

    return res.json({
      statusCode: 200,
      success: true,
      msg: 'Logout Successful!'
    });
  } else {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      msg: 'No User Logged In!'
    });
  }
}

const UserController = {
  loginUser,
  logoutUser,
  registerUser,
  getUserProfile
};

module.exports = UserController;
