const express = require('express');
     const mongoose = require('mongoose');
     const cors = require('cors');
     const http = require('http');
     const { Server } = require('socket.io');
     const dotenv = require('dotenv');
     const deviceRoutes = require('./routes/devices');
     const slideRoutes = require('./routes/slides');
     const templateRoutes = require('./routes/templates');
     const contentRoutes = require('./routes/content');
     const authRoutes = require('./routes/auth');
     const authMiddleware = require('./middleware/auth');

     dotenv.config();

     const app = express();
     const server = http.createServer(app);
     const io = new Server(server, {
       cors: {
         origin: [process.env.FRONTEND_URL, 'http://localhost:5174'],
         methods: ['GET', 'POST', 'PUT', 'DELETE'],
         credentials: true
       }
     });

     app.use(cors({
       origin: [process.env.FRONTEND_URL, 'http://localhost:5174'],
       methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
       credentials: true
     }));
     app.use(express.json());
     app.use('/slides', express.static('public/slides'));

     mongoose.connect(process.env.MONGODB_URI, {
       useNewUrlParser: true,
       useUnifiedTopology: true
     }).then(() => {
       console.log('Connected to MongoDB');
     }).catch(err => {
       console.error('MongoDB connection error:', err);
     });

     app.use('/api/auth', authRoutes);
     app.use('/api/devices', authMiddleware, deviceRoutes);
     app.use('/api/slides', authMiddleware, slideRoutes);
     app.use('/api/templates', authMiddleware, templateRoutes);
     app.use('/api/content', authMiddleware, contentRoutes);

     io.on('connection', (socket) => {
       console.log('Client connected:', socket.id);
       socket.on('disconnect', () => {
         console.log('Client disconnected:', socket.id);
       });
     });

     const PORT = process.env.PORT || 5000;
     server.listen(PORT, () => {
       console.log(`Server running on port ${PORT}`);
     });

     module.exports = { io };