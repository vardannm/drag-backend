const express = require('express');
const Slide = require('../models/Slide');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const slides = await Slide.find();
    res.json(slides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { id, name, images } = req.body;
    const slide = new Slide({ id, name, images });
    await slide.save();
    res.status(201).json(slide);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, images } = req.body;
    const slide = await Slide.findOneAndUpdate(
      { id: req.params.id },
      { name, images },
      { new: true }
    );
    if (!slide) return res.status(404).json({ error: 'Slide not found' });
    res.json(slide);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const slide = await Slide.findOneAndDelete({ id: req.params.id });
    if (!slide) return res.status(404).json({ error: 'Slide not found' });
    res.json({ message: 'Slide deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;