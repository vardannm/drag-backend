const express = require('express');
const Device = require('../models/Device');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const device = await Device.findOne({ id: req.params.id });
    if (!device) return res.status(404).json({ error: 'Device not found' });
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { id, name, location, status, selectedSlideId } = req.body;
    const device = new Device({ id, name, location, status, selectedSlideId });
    await device.save();
    res.status(201).json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, location, status, selectedSlideId } = req.body;
    const device = await Device.findOneAndUpdate(
      { id: req.params.id },
      { name, location, status, selectedSlideId, lastUpdate: new Date().toISOString() },
      { new: true }
    );
    if (!device) return res.status(404).json({ error: 'Device not found' });
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;