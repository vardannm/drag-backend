const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  path: { type: String, required: true }
});

module.exports = mongoose.model('Template', templateSchema);