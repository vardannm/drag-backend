const mongoose = require('mongoose');

     const deviceSchema = new mongoose.Schema({
       userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true
       },
       name: {
         type: String,
         required: true
       },
       location: {
         type: String,
         required: true
       },
       status: {
         type: String,
         enum: ['Active', 'Inactive'],
         default: 'Active'
       },
       selectedSlideId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Slide'
       },
       link: {
         type: String,
         unique: true
       },
       lastUpdate: {
         type: Date,
         default: Date.now
       }
     });

     module.exports = mongoose.model('Device', deviceSchema);