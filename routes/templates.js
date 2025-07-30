const express = require('express');
     const router = express.Router();
     const Template = require('../models/Template');
     const authMiddleware = require('../middleware/auth');

     // Get all templates for the logged-in user
     router.get('/', authMiddleware, async (req, res) => {
       try {
         console.log('Fetching templates for user:', req.user.userId);
         const templates = await Template.find({ userId: req.user.userId });
         res.json(templates);
       } catch (err) {
         console.error('Error fetching templates:', err);
         res.status(500).json({ error: err.message });
       }
     });

     // Get a single template by ID
     router.get('/:id', authMiddleware, async (req, res) => {
       try {
         const template = await Template.findOne({ _id: req.params.id, userId: req.user.userId });
         if (!template) {
           return res.status(404).json({ error: 'Template not found' });
         }
         res.json(template);
       } catch (err) {
         console.error('Error fetching template:', err);
         res.status(500).json({ error: err.message });
       }
     });

     // Create a new template for the logged-in user
     router.post('/', authMiddleware, async (req, res) => {
       try {
         const { name, path, data } = req.body;
         if (!name || !path || !data) {
           return res.status(400).json({ error: 'Name, path, and data are required' });
         }
         const template = new Template({
           userId: req.user.userId,
           name,
           path,
           data
         });
         await template.save();
         console.log('Template saved:', template);
         res.status(201).json(template);
       } catch (err) {
         console.error('Error creating template:', err);
         res.status(500).json({ error: err.message });
       }
     });

     // Update an existing template
     router.put('/:id', authMiddleware, async (req, res) => {
       try {
         const { data } = req.body;
         if (!data) {
           return res.status(400).json({ error: 'Data is required' });
         }
         const template = await Template.findOneAndUpdate(
           { _id: req.params.id, userId: req.user.userId },
           { data },
           { new: true }
         );
         if (!template) {
           return res.status(404).json({ error: 'Template not found' });
         }
         console.log('Template updated:', template);
         res.json(template);
       } catch (err) {
         console.error('Error updating template:', err);
         res.status(500).json({ error: err.message });
       }
     });

     module.exports = router;