const NewHotel = require("../Models/newHotel");
const Room = require("../Models/Room");
const Reservation = require("../Models/Reservation");
const Hotel = require("../Models/Hotel");

const searchHotels = async (req, res) => {
  const { city, country } = req.query;

  try {
    // Create filter object based on provided query parameters
    let filter = {};
    if (city) filter["city"] = city;
    if (country) filter["country"] = country;

    // Find hotels matching the criteria
    let hotels = await NewHotel.find(filter)

    // // Filter hotels based on room availability
    // if (check_in && check_out) {
    //   const checkInDate = new Date(check_in);
    //   const checkOutDate = new Date(check_out);

    //   hotels = await Promise.all(
    //     hotels.map(async (hotel) => {
    //       const availableRooms = await Promise.all(
    //         hotel.rooms.map(async (room) => {
    //           const reservedCount = await Reservation.countDocuments({
    //             room_id: room._id,
    //             $or: [
    //               {
    //                 check_in: { $lt: checkInDate },
    //                 check_out: { $gt: checkInDate },
    //               },
    //               {
    //                 check_in: { $lt: checkOutDate },
    //                 check_out: { $gt: checkOutDate },
    //               },
    //               {
    //                 check_in: { $gte: checkInDate },
    //                 check_out: { $lte: checkOutDate },
    //               },
    //             ],
    //           });
    //           // Check if the room is available
    //           return reservedCount === 0;
    //         })
    //       );

    //       // Return hotel if at least one room type is available
    //       if (availableRooms.some((isAvailable) => isAvailable)) {
    //         return hotel;
    //       }
    //       return null;
    //     })
    //   );

    //   // Filter out null results
    //   hotels = hotels.filter((hotel) => hotel !== null);
    // }

    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all different chains available
const getAllChains = async (req, res) => {
  try {
    const chains = await NewHotel.distinct("chain");
    res.status(200).json({ chains });
  } catch (error) {
    res.status(500).json({ message: "Error fetching chains", error });
  }
};

// Get all hotels for a particular chain
const getHotelsByChain = async (req, res) => {
  try {
    const { chain } = req.params;
    const hotels = await NewHotel.find({ chain });
    res.status(200).json({ hotels });
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels for chain", error });
  }
};

// Get the count of hotels for a chain
const getHotelCountByChain = async (req, res) => {
  try {
    const { chain } = req.params;
    const count = await NewHotel.countDocuments({ chain });
    res.status(200).json({ count });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching hotel count for chain", error });
  }
};

const getSortedHotelByMoreHotelInCountry = async (req, res) => {
  try {
    const result = await Hotel.aggregate([
      {
        $group: {
          _id: "$country",
          hotelCount: { $sum: 1 },
        },
      },
      {
        $sort: { hotelCount: -1 },
      },
    ]);

    const countries = result.map((item) => ({
      country: item._id,
      hotelCount: item.hotelCount,
    }));

    console.log(countries);
    return res.status(200).json(countries);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  searchHotels,
  getAllChains,
  getHotelsByChain,
  getHotelCountByChain,
  getSortedHotelByMoreHotelInCountry,
};
