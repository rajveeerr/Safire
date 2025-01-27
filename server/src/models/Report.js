const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  screenshotUrl: String,
  notes: String,
  time: { type: Date, required: true },
  platform: { type: String, required: true },
  userProfileDetails: mongoose.Schema.Types.Mixed,
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['pending', 'submitted', 'resolved'],
    default: 'pending'
  },
},{ timestamps: true });

const Report = mongoose.model('Report', reportSchema);

module.exports = {
    Report
  };