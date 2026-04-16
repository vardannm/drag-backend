const express = require('express');
     const bcrypt = require('bcryptjs');
     const jwt = require('jsonwebtoken');
     const User = require('../models/User');
     const router = express.Router();

     router.post('/register', async (req, res) => {
       return res.status(403).json({ error: 'Self-registration is disabled. Admin must create users manually.' });
     });

     router.post('/login', async (req, res) => {
       try {
         const { login, password } = req.body;
         if (!login || !password) {
           return res.status(400).json({ error: 'Login and password are required' });
         }
         const user = await User.findOne({ login });
         if (!user) {
           return res.status(401).json({ error: 'Invalid credentials' });
         }
         const isMatch = await bcrypt.compare(password, user.password);
         if (!isMatch) {
           return res.status(401).json({ error: 'Invalid credentials' });
         }
         const token = jwt.sign({ userId: user._id, name: user.name, login: user.login }, process.env.JWT_SECRET, { expiresIn: '1h' });
         res.json({ token, user: { name: user.name, login: user.login } });
       } catch (err) {
         res.status(500).json({ error: err.message });
       }
     });

     module.exports = router;