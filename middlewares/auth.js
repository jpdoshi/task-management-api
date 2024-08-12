const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const decoded = jwt.decode(req.cookies.jwt);
  
  if (!decoded) {
    res.status(400).json({
      statusCode: 400,
      succeed: false,
      error: 'Could Not Verify Token'
    });
  } else {
    req.user = decoded;
    return next();
  }
}

module.exports = authMiddleware;
