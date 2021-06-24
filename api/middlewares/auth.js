const jwt = require('jsonwebtoken');

module.exports.protect = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT);

    req.userData = decoded;
    next();
  } catch (err) {
    res.status(401).send('Auth failed');
  }
};

module.exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userData.role))
      return next(res.status(403).send('Access denied'));
    next();
  };
};
