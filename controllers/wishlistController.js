const User = require('../Models/User');

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  const userId = req.user.id;
  const { hotelId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.wishlist.includes(hotelId)) {
      return res.status(400).json({ message: "Hotel already in wishlist" });
    }

    user.wishlist.push(hotelId);
    await user.save();

    res.status(200).json({ message: "Hotel added to wishlist" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get wishlist
exports.getWishlist = async (req, res) => {
  const userId = req.user.id; // Extracted from JWT

  try {
    const user = await User.findById(userId).populate('wishlist');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // if (user.wishlist.length === 0) {
    //   return res.status(200).json({ message: "Wishlist is empty" });
    // }

    // console.log("user:", user)

    res.status(200).json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  const userId = req.user.id;
  const { hotelId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist = user.wishlist.filter(hotel => hotel.toString() !== hotelId);
    await user.save();

    res.status(200).json({ message: "Hotel removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
