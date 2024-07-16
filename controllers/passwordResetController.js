const Otp = require('../Models/Otp');
const User = require('../Models/User');
const bcrypt = require('bcrypt');

const resetPassword = async (req, res) => {
  try {
    const { mail, otp, newPassword } = req.body;

    // Validate OTP
    const otpRecord = await Otp.findOne({ mail, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password
    await User.updateOne({ mail }, { password: hashedPassword });

    // Delete OTP record after successful password reset
    await Otp.deleteOne({ mail, otp });
    console.log("Password reset sucessfully");
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { resetPassword };
