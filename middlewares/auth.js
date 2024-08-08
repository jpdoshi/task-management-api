const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const decoded = jwt.decode(req.cookies.jwt);
  if (!decoded) {
    res.status(500).send('Could Not Verify Token');
  }

  req.user = decoded;
  return next();
}

module.exports = authMiddleware;
