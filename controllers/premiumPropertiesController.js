const newHotel = require('../Models/newHotel');

// Function to get hotels sorted by rating
const getHotelsSortedByRating = async (req, res) => {
  try {
    
    const hotels = await newHotel.find({});

    // Sort hotels by rating
    const sortedHotels = hotels.sort((a, b) => {
      if (a.stars === null) return 1;
      if (b.stars === null) return -1;
      return b.stars - a.stars;
    });

    // Return the sorted list
    res.json(sortedHotels);
  } catch (err) {
    console.error('Error fetching hotels:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getHotelsSortedByRating };
