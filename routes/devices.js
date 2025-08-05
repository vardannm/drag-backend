const express = require('express');
     const router = express.Router();
     const Device = require('../models/Device');
     const Slide = require('../models/Slide');
     const authMiddleware = require('../middleware/auth');
     const { v4: uuidv4 } = require('uuid');

     // Get all devices for the logged-in user
     router.get('/', authMiddleware, async (req, res) => {
       try {
         console.log('Fetching devices for user:', req.user.userId);
         const devices = await Device.find({ userId: req.user.userId }).populate('selectedSlideId', 'name image');
         res.json(devices);
       } catch (err) {
         console.error('Error fetching devices:', err);
         res.status(500).json({ error: err.message });
       }
     });

     // Get a single device by ID
     router.get('/:id', authMiddleware, async (req, res) => {
       try {
         const device = await Device.findOne({ _id: req.params.id, userId: req.user.userId }).populate('selectedSlideId', 'name image');
         if (!device) {
           return res.status(404).json({ error: 'Device not found' });
         }
         console.log('Fetched device:', device);
         res.json(device);
       } catch (err) {
         console.error('Error fetching device:', err);
         res.status(500).json({ error: err.message });
       }
     });

     // Create a new device
     router.post('/', authMiddleware, async (req, res) => {
       try {
         const { name, location, status, selectedSlideId } = req.body;
         if (!name || !location) {
           return res.status(400).json({ error: 'Name and location are required' });
         }
         const device = new Device({
           userId: req.user.userId,
           name,
           location,
           status: status || 'Active',
           selectedSlideId,
           link: uuidv4() // Generate unique link
         });
         await device.save();
         console.log('Device created:', device);
         res.status(201).json(device);
       } catch (err) {
         console.error('Error creating device:', err);
         res.status(500).json({ error: err.message });
       }
     });

     // Update a device
     router.put('/:id', authMiddleware, async (req, res) => {
       try {
         const { name, location, status, selectedSlideId } = req.body;
         const device = await Device.findOneAndUpdate(
           { _id: req.params.id, userId: req.user.userId },
           { name, location, status, selectedSlideId },
           { new: true }
         );
         if (!device) {
           return res.status(404).json({ error: 'Device not found' });
         }
         console.log('Device updated:', device);
         res.json(device);
       } catch (err) {
         console.error('Error updating device:', err);
         res.status(500).json({ error: err.message });
       }
     });

     // Delete a device
     router.delete('/:id', authMiddleware, async (req, res) => {
       try {
         const device = await Device.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
         if (!device) {
           return res.status(404).json({ error: 'Device not found' });
         }
         console.log('Device deleted:', device);
         res.json({ message: 'Device deleted' });
       } catch (err) {
         console.error('Error deleting device:', err);
         res.status(500).json({ error: err.message });
       }
     });

     // Get slide by device link
     router.get('/link/:link', async (req, res) => {
       try {
         const device = await Device.findOne({ link: req.params.link }).populate('selectedSlideId', 'image');
         if (!device || !device.selectedSlideId) {
           return res.status(404).json({ error: 'Slide not found' });
         }
         console.log('Fetched slide by link:', device.selectedSlideId);
         res.json({ image: device.selectedSlideId.image });
       } catch (err) {
         console.error('Error fetching slide by link:', err);
         res.status(500).json({ error: err.message });
       }
     });

     module.exports = router;