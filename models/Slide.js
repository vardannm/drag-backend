const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  images: [{ type: String, required: true }]
});

module.exports = mongoose.model('Slide', slideSchema);