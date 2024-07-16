const User = require('../Models/User');
const Otp = require('../Models/Otp');
const { validationResult } = require('express-validator');

const register = async (req, res) => {
  try {
    const { username, mail, phone, password, accountType, idProof, otp } = req.body;

    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verify OTP
    const otpRecord = await Otp.findOne({ mail, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Check if the user already exists by email
    const existingUser = await User.findOne({ mail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create a new user
    const newUser = new User({ username, mail, phone, password, accountType, idProof });
    await newUser.save();

    // Delete OTP record after successful registration
    await Otp.deleteOne({ mail, otp });

    console.log('User registered successfully');
    // Generate JWT token
    const token = newUser.generateAuthToken();
    console.log('Registration successful, token generated:', token);
    res.json({ token });

    // res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register };
