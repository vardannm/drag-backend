const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Middleware: Received token:', token);

  if (!token) {
    console.log('Middleware: No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Middleware: Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Middleware: Token verification error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};