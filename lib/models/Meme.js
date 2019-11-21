const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema ({
  topText: {
    type: String
  },
  bottomText: {
    type: String
  },
  url: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Meme', schema);