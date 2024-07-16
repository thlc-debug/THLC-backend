const Otp = require('../Models/Otp');
const User = require('../Models/User');  // Import the User model to check if email exists
const sendResetEmail = require('../utils/sendResetEmail');

const sendResetOtp = async (req, res) => {
  try {
    const { mail } = req.body;

    // Check if email is registered in User collection
    const user = await User.findOne({ mail });
    if (!user) {
      return res.status(400).json({ message: 'Email is not registered' });
    }

    // Check if OTP has already been sent recently
    const otpExists = await Otp.findOne({ mail });
    if (otpExists) {
      return res.status(400).json({ message: 'OTP already sent. Please wait for 2 minutes before requesting again.' });
    }

    // Generate a 6-digit OTP
    const otpLength = 6; 
    let otp = '';
    for (let i = 0; i < otpLength; i++) {
      otp += Math.floor(Math.random() * 10); 
    }

    console.log("OTP Generated for Password Reset");

    // Save OTP to the database
    const otpRecord = new Otp({ mail, otp });
    await otpRecord.save();

    // Send OTP via email
    await sendResetEmail(mail, otp);

    console.log('Password reset OTP sent successfully');
    res.status(200).json({ message: 'Password reset OTP sent successfully' });
  } catch (err) {
    console.error('Error sending password reset OTP:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { sendResetOtp };
