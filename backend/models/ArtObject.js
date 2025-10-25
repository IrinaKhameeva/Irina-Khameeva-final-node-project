const mongoose = require('mongoose');

const ArtObjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide artwork title'],
    maxlength: 100,
  },
  culture: {
    type: String,
    maxlength: 50,
  },
  period: {
    type: String,
    maxlength: 50,
  },
  medium: {
    type: String,
    maxlength: 100,
  },
  image: {
    type: String,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user'],
  },
}, { timestamps: true });

module.exports = mongoose.model('ArtObject', ArtObjectSchema);


