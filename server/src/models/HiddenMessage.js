const mongoose = require('mongoose');

const hiddenMessageSchema = new mongoose.Schema({
    messageContent: { type: String, required: true },
    timeOfMessage: { type: Date, required: true },
    userName: { type: String, required: true },
    profileUrl: { type: String, required: true },
    platform: { type: String, default: 'unknown' },
    hiddenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    relatedHiddenUser: { type: mongoose.Schema.Types.ObjectId, ref: 'HiddenUser' },
    metadata: {
      messageType: { type: String, enum: ['text', 'media', 'voice'], default: 'text' },
      context: String,
      source: String
    }
}, { timestamps: true });

hiddenMessageSchema.index(
    { 
      messageContent: 1, 
      userName: 1, 
      profileUrl: 1, 
      hiddenBy: 1,
      platform: 1
    }, 
    { unique: true }
);
  
  
const HiddenMessage = mongoose.model('HiddenMessage', hiddenMessageSchema);
  
module.exports = { HiddenMessage };