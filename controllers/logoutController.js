// Log out a user
const logout = (req, res) => {
  // The token is invalidated on the client-side
  res.clearCookie('token'); // Clear the token from cookies
  console.log("Logout Successfully")
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { logout };
