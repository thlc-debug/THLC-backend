const newHotel = require("../Models/newHotel");

// Function to get hotels sorted by rating
const getHotelsSortedByRating = async (req, res) => {
  try {
    const hotels = await newHotel.find({ stars: { $gte: 5 } });

    // Sort hotels by rating
    // const sortedHotels = hotels.sort((a, b) => {
    //   if (a.stars === null) return 1;
    //   if (b.stars === null) return -1;
    //   return b.stars - a.stars;
    // });

    // Return the sorted list
    res.status(200).json(hotels);
  } catch (err) {
    console.error("Error fetching hotels:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getHotelsSortedByRating };
