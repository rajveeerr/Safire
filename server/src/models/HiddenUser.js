const mongoose = require('mongoose');

const hiddenUserSchema = new mongoose.Schema({
    userId: { type: String },
    name: { type: String, required: true },
    profileUrl: { type: String, required: true },
    hiddenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    hiddenMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'HiddenMessage' }],
    statistics: {
        totalMessagesHidden: { type: Number, default: 0 },
        lastMessageHidden: Date,
        firstMessageHidden: Date
    },
    platform: String,
    reason: String,
    randomProfileImage: { type: String },
    isHarasser: { type: Boolean, default: false },
    totalHideCount: { type: Number, default: 0 },
    lastReviewDate: Date
}, { timestamps: true });

hiddenUserSchema.pre('save', function(next) {
    if (!this.randomProfileImage) {
        const randomNumber = Math.floor(Math.random() * 50);
        this.randomProfileImage = `https://avatar.iran.liara.run/public/?${randomNumber}`;
    }
    next();
});



const HiddenUser = mongoose.model('HiddenUser', hiddenUserSchema);

module.exports = {
    HiddenUser
  };