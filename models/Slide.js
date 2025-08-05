const mongoose = require('mongoose');

     const slideSchema = new mongoose.Schema({
       userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true
       },
       name: {
         type: String,
         required: true
       },
       image: {
         type: String,
         required: true
       },
       templateIds: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Template'
       }],
       createdAt: {
         type: Date,
         default: Date.now
       }
     });

     module.exports = mongoose.model('Slide', slideSchema);