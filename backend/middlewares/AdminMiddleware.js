const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies) {
    const cookieVal = req.cookies.Authorization || req.cookies.authorization;
    if (cookieVal) {
      if (cookieVal.startsWith('Bearer ')) {
        token = cookieVal.split(' ')[1];
      } else {
        token = cookieVal;
      }
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role != process.env.DB_ADMIN_ROLE_ID) return res.status(403).json({ message: "Token is not from admin " });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};
