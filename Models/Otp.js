const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  mail: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => Date.now() + 2 * 60 * 1000 } // OTP expires in 2 minutes
}, { timestamps: true });

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.models.Otp || mongoose.model('Otp', otpSchema);
