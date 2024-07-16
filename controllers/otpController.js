const Otp = require('../Models/Otp');
const User = require('../Models/User');
const sendEmail = require('../utils/sendEmail');
const { validationResult } = require('express-validator');

// Send OTP
const sendOtp = async (req, res) => {
  try {
    const { mail } = req.body;

    // Check if OTP already exists
    const otpExists = await Otp.findOne({ mail });
    if (otpExists) {
      return res.status(400).json({ message: 'OTP already sent. Please wait for 2 minutes before requesting again.' });
    }

    // Generate a numeric OTP
    const otpLength = 6; 
    let otp = '';
    for (let i = 0; i < otpLength; i++) {
      otp += Math.floor(Math.random() * 10);
    }

    console.log("OTP Generated");

    // Save OTP to the database
    const otpRecord = new Otp({ mail, otp });
    await otpRecord.save();

    // Send OTP via email
    await sendEmail(mail, otp);

    console.log('OTP sent successfully');
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ message: err.message });
  }
};

// Validate OTP
const validateOtp = async (req, res) => {
  try {
    const { mail, otp } = req.body;

    // Validate OTP
    const otpRecord = await Otp.findOne({ mail, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.status(200).json({ message: 'OTP validated successfully' });
  } catch (err) {
    console.error('Error validating OTP:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { sendOtp, validateOtp };
