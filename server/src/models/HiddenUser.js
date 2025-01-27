const mongoose = require('mongoose');

const hiddenUserSchema = new mongoose.Schema({
    userId: { type: String },
    name: { type: String, required: true },
    hiddenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    platform: String,
    reason: String,
  }, { timestamps: true });

const HiddenUser = mongoose.model('HiddenUser', hiddenUserSchema);

module.exports = {
    HiddenUser
  };