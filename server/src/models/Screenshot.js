const mongoose = require('mongoose');

const screenshotSchema = new mongoose.Schema({
  screenshotUrl: { type: String, required: true },
  time: { type: Date, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  relatedReport: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
  platform: String,
},{ timestamps: true });

const Screenshot = mongoose.model('Screenshot', screenshotSchema);

module.exports = {
    Screenshot
  };