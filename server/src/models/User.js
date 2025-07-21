const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: String,
  gender: String,
  preferences: {
    autoGenerateReport: { type: Boolean, default: false },
    autoSaveScreenshots: { type: Boolean, default: false },
    enableTags: { type: Boolean, default: true }
  },
  trustedContacts: [{
    name: String,
    email: String
  }],
  totalBlockedMessages: { type: Number, default: 0 },
  hiddenUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'HiddenUser' }],
  hiddenMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'HiddenMessage' }],
  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Report' }],
  screenshots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Screenshot' }],
}, { timestamps: true });

userSchema.pre('save', function(next) {
  if (!this.profilePicture) {
      this.randomProfileImage = `https://avatar.iran.liara.run/public/${this.gender==="female"?"girl":"boy"}?username=${this.name}`;
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = {
  User
};
