const mongoose = require('mongoose');

const templateDataSchema = new mongoose.Schema({
  templateId: { type: Number, required: true, unique: true },
  canvasData: { type: Object, required: true }
});

module.exports = mongoose.model('TemplateData', templateDataSchema);