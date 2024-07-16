const User = require('../Models/User');

const getActiveUsers = async (req, res) => {
  try {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000); // 2 minutes ago
    const activeUsers = await User.find({ lastLoggedIn: { $gte: twoMinutesAgo } }).select('-password');
    res.json({ activeUsers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getActiveUsers };
