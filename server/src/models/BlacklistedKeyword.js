const mongoose = require('mongoose');

const blacklistedKeywordSchema = new mongoose.Schema({
  keywords: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},{ timestamps: true });

const BlacklistedKeyword = mongoose.model('BlacklistedKeyword', blacklistedKeywordSchema);

module.exports = {
    BlacklistedKeyword
  };