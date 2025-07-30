const jwt = require('jsonwebtoken');

     const authMiddleware = (req, res, next) => {
       const token = req.header('Authorization')?.replace('Bearer ', '');
       if (!token) {
         return res.status(401).json({ error: 'No token provided' });
       }
       try {
         const decoded = jwt.verify(token, 'your_jwt_secret');
         req.user = decoded;
         next();
       } catch (err) {
         res.status(401).json({ error: 'Invalid token' });
       }
     };

     module.exports = authMiddleware;