const express = require('express');
const Content = require('../models/Content');
const { io } = require('../index');
const router = express.Router();

router.get('/:templateId/:shapeId', async (req, res) => {
  try {
    const content = await Content.findOne({ 
      templateId: parseInt(req.params.templateId), 
      shapeId: req.params.shapeId 
    });
    if (!content) return res.status(404).json({ error: 'Content not found' });
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:templateId/:shapeId', async (req, res) => {
  try {
    const { text } = req.body;
    const content = await Content.findOneAndUpdate(
      { templateId: parseInt(req.params.templateId), shapeId: req.params.shapeId },
      { text },
      { upsert: true, new: true }
    );
    io.emit('contentUpdate', { 
      templateId: parseInt(req.params.templateId), 
      shapeId: req.params.shapeId, 
      text 
    });
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;