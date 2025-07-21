const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  timestamp: { type: Date, required: true },
  type: { type: String, default: 'text' },
  context: { type: String }
}, { _id: false });

const screenshotSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Screenshot' },
  screenshotUrl: { type: String, required: true },
  timestamp: { type: Date, required: true },
  context: { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { _id: false });

const reportSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  profileUrl: { type: String, required: true },
  platform: { type: String, required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'submitted', 'resolved', 'generated'],
    default: 'pending'
  },
  userProfileDetails: {
    profileUrl: String,
    profilePicUrl: String,
    platform: String,
    isKnownHarasser: Boolean,
    totalHideCount: Number
  },
  evidence: {
    messages: [messageSchema],
    screenshots: [screenshotSchema],
    statistics: {
      total: Number,
      types: [String],
      frequency: Number,
      timespan: Number,
      platform: String
    }
  },
  summary: {
    severityAssessment: String,
    keyFindings: [String],
    behavioralPatterns: [String],
    legalConsiderations: [String],
    recommendedActions: [String],
    riskLevel: String,
    summaryText: String
  },
  metadata: {
    generatedAt: { type: Date, default: Date.now },
    requestReason: String,
    additionalNotes: String,
    userNotes: String,
    evidenceTimespan: {
      start: Date,
      end: Date
    }
  },
  legalDisclaimer: String
}, { 
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      if (ret.evidence && ret.evidence.screenshots) {
        ret.evidence.screenshots = ret.evidence.screenshots.map(screenshot => ({
          ...screenshot,
          url: screenshot.screenshotUrl 
        }));
      }
      return ret;
    }
  }
});

reportSchema.methods.withScreenshots = function() {
  return this.populate('evidence.screenshots._id');
};

const Report = mongoose.model('Report', reportSchema);

module.exports = {
    Report
};