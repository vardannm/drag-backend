const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  shapeId: { type: String, required: true },
  templateId: { type: Number, required: true },
  text: { type: String, required: true }
}, { indexes: [{ key: { shapeId: 1, templateId: 1 }, unique: true }] });

module.exports = mongoose.model('Content', contentSchema);