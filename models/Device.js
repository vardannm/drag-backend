const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  lastUpdate: { type: String, default: new Date().toISOString() },
  selectedSlideId: { type: Number, required: true }
});

module.exports = mongoose.model('Device', deviceSchema);