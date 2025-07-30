const mongoose = require('mongoose');

     const templateSchema = new mongoose.Schema({
       userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true
       },
       name: {
         type: String,
         required: true
       },
       path: {
         type: String,
         required: true
       },
       data: {
         type: Object,
         required: true
       },
       createdAt: {
         type: Date,
         default: Date.now
       }
     });

     module.exports = mongoose.model('Template', templateSchema);