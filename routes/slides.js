const express = require('express');
     const router = express.Router();
     const Slide = require('../models/Slide');
     const authMiddleware = require('../middleware/auth');

     // Get all slides for the logged-in user
     router.get('/', authMiddleware, async (req, res) => {
       try {
         console.log('Fetching slides for user:', req.user.userId);
         const slides = await Slide.find({ userId: req.user.userId }).populate('templateIds', 'name');
         res.json(slides);
       } catch (err) {
         console.error('Error fetching slides:', err);
         res.status(500).json({ error: err.message });
       }
     });

     // Get a single slide by ID
     router.get('/:id', authMiddleware, async (req, res) => {
       try {
         const slide = await Slide.findOne({ _id: req.params.id, userId: req.user.userId }).populate('templateIds', 'name');
         if (!slide) {
           return res.status(404).json({ error: 'Slide not found' });
         }
         console.log('Fetched slide:', slide);
         res.json(slide);
       } catch (err) {
         console.error('Error fetching slide:', err);
         res.status(500).json({ error: err.message });
       }
     });

     // Create a new slide for the logged-in user
     router.post('/', authMiddleware, async (req, res) => {
       try {
         const { name, image, templateIds } = req.body;
         if (!name || !image) {
           return res.status(400).json({ error: 'Name and image are required' });
         }
         const slide = new Slide({
           userId: req.user.userId,
           name,
           image,
           templateIds: templateIds || []
         });
         await slide.save();
         console.log('Slide created:', slide);
         res.status(201).json(slide);
       } catch (err) {
         console.error('Error creating slide:', err);
         res.status(500).json({ error: err.message });
       }
     });

     // Update an existing slide
     router.put('/:id', authMiddleware, async (req, res) => {
       try {
         const { name, image, templateIds } = req.body;
         const slide = await Slide.findOneAndUpdate(
           { _id: req.params.id, userId: req.user.userId },
           { name, image, templateIds: templateIds || [] },
           { new: true }
         );
         if (!slide) {
           return res.status(404).json({ error: 'Slide not found' });
         }
         console.log('Slide updated:', slide);
         res.json(slide);
       } catch (err) {
         console.error('Error updating slide:', err);
         res.status(500).json({ error: err.message });
       }
     });

     module.exports = router;