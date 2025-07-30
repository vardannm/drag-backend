const express = require('express');
const Template = require('../models/Template');
const TemplateData = require('../models/TemplateData');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const templates = await Template.find();
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const template = await Template.findOne({ id: req.params.id });
    if (!template) return res.status(404).json({ error: 'Template not found' });
    const templateData = await TemplateData.findOne({ templateId: req.params.id });
    res.json({ ...template.toObject(), canvasData: templateData ? templateData.canvasData : null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { id, name, path, canvasData } = req.body;
    const template = new Template({ id, name, path });
    await template.save();
    if (canvasData) {
      const templateData = new TemplateData({ templateId: id, canvasData });
      await templateData.save();
    }
    res.json({ ...template.toObject(), canvasData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, path, canvasData } = req.body;
    const template = await Template.findOneAndUpdate(
      { id: req.params.id },
      { name, path },
      { new: true }
    );
    if (!template) return res.status(404).json({ error: 'Template not found' });
    if (canvasData) {
      await TemplateData.findOneAndUpdate(
        { templateId: req.params.id },
        { canvasData },
        { upsert: true, new: true }
      );
    }
    res.json({ ...template.toObject(), canvasData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const template = await Template.findOneAndDelete({ id: req.params.id });
    if (!template) return res.status(404).json({ error: 'Template not found' });
    await TemplateData.findOneAndDelete({ templateId: req.params.id });
    res.json({ message: 'Template deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;