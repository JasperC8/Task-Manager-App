const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = (roles = []) => {
  return async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select('-password');

        if (!user || (roles.length && !roles.includes(user.role))) {
          return res.status(403).json({ message: 'Forbidden' });
        }

        req.user = user;
        next();
      } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
      }
    } else {
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  };
};

module.exports = { protect };
