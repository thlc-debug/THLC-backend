const User = require('../Models/User');

// Login a user
const login = async (req, res) => {
  try {
    const { mail, password } = req.body;
    if (!mail || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find the user by email
    const user = await User.findOne({ mail });
    if (!user) {
      console.log('User not found for email:', mail);
      return res.status(400).json({ message: 'Invalid email' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ message: 'Invalid password' });
    }

    //Last loggedin
    user.lastLoggedIn = new Date();
    await user.save();

    // Generate JWT token
    const token = user.generateAuthToken();
    console.log('Login successful, token generated:', token);
    res.json({ token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { login };
