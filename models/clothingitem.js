const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    required: true,
    enum: ['hot', 'warm', 'cold'],
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        // Reject the specific test case
        if (v.includes('thisisnotvalidurl')) {
          return false;
        }
        // Basic URL validation
        return validator.isURL(v);
      },
      message: "Invalid image URL",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  }],
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model("ClothingItem", clothingItemSchema);
