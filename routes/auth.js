const express = require('express');
     const bcrypt = require('bcryptjs');
     const jwt = require('jsonwebtoken');
     const User = require('../models/User');
     const router = express.Router();

     router.post('/register', async (req, res) => {
       try {
         const { name, login, password } = req.body;
         if (!name || !login || !password) {
           return res.status(400).json({ error: 'All fields are required' });
         }
         const existingUser = await User.findOne({ login });
         if (existingUser) {
           return res.status(400).json({ error: 'Login already exists' });
         }
         const hashedPassword = await bcrypt.hash(password, 10);
         const user = new User({ name, login, password: hashedPassword });
         await user.save();
         const token = jwt.sign({ userId: user._id, name: user.name, login: user.login }, process.env.JWT_SECRET, { expiresIn: '1h' });
         res.status(201).json({ token, user: { name: user.name, login: user.login } });
       } catch (err) {
         res.status(500).json({ error: err.message });
       }
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