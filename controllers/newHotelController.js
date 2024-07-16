const NewHotel = require('../Models/newHotel');

exports.getAllNewHotels = async (req, res) => {
  try {
    const newHotels = await NewHotel.find();
    res.json(newHotels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNewHotelById = async (req, res) => {
  try {
    const newHotel = await NewHotel.findById(req.params.id);
    if (newHotel == null) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json(newHotel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createNewHotel = async (req, res) => {
  const newHotel = new NewHotel(req.body);
  try {
    const newNewHotel = await newHotel.save();
    res.status(201).json(newNewHotel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateNewHotel = async (req, res) => {
  try {
    const newHotel = await NewHotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (newHotel == null) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json(newHotel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteNewHotel = async (req, res) => {
  try {
    const newHotel = await NewHotel.findByIdAndDelete(req.params.id);
    if (newHotel == null) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json({ message: 'Hotel deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//hotel in Aplphabatical order
exports.getHotelNamesAlphabetically = async (req, res) => {
  try {
    const hotels = await NewHotel.find({}, 'name').sort({ name: 1 });
    const hotelNames = hotels.map(hotel => hotel.name);
    res.status(200).json(hotelNames);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Countries sorted by hotel count
exports.getCountryNamesSortedByHotelCount = async (req, res) => {
  try {
    const countries = await NewHotel.aggregate([
      { $group: { _id: "$country", hotelCount: { $sum: 1 } } },
      { $sort: { hotelCount: -1 } },
      { $project: { _id: 0, country: "$_id", hotelCount: 1 } }
    ]);
    const countryNames = countries.map(country => country.country);

    res.status(200).json(countryNames);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Fetch all Resorts
exports.getResorts = async (req, res) => {
  try {
    const resorts = await NewHotel.find({ type: 'Resort' });
    res.status(200).json(resorts);
  } catch (err) {
    console.error('Error fetching resorts:', err);
    res.status(500).json({ message: 'Error fetching resorts', error: err.message });
  }
};


exports.getHotels = async (req, res) => {
  try {
    const hotels = await NewHotel.find({ type: 'Hotel' });
    res.status(200).json(hotels);
  } catch (err) {
    console.error('Error fetching hotels:', err);
    res.status(500).json({ message: 'Error fetching hotels', error: err.message });
  }
};

exports.getTopCountriesByHotelCount = async (req, res) => {
  try {
    const topCountries = await NewHotel.aggregate([
      {
        $group: {
          _id: "$country",
          // hotelCount: { $sum: 1 }
        }
      },
      {
        $sort: { hotelCount: -1 }
      },
      {
        $limit: 10
      }
    ]);
    res.json(topCountries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get Hotel by country
exports.getHotelsByCountry = async (req, res) => {
  try {
    const country = req.params.country;
    const hotels = await NewHotel.find({ "country": country });
    res.status(200).json(hotels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Hotel Count by Country
exports.getHotelCountByCountry = async (req, res) => {
  try {
    const country = req.params.country;
    const hotelCount = await NewHotel.countDocuments({ "country": country });
    res.json({ country, hotelCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get countries alphabtically sorted
exports.getCountriesAlphabetically = async (req, res) => {
  try {
    const countries = await NewHotel.distinct("country");
    const sortedCountries = countries.sort();
    res.status(200).json(sortedCountries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Hotel by city
exports.getHotelsByCity = async (req, res) => {
  try {
    const city = req.params.city;
    const hotels = await NewHotel.find({ "city": city });
    res.status(200).json(hotels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getHotelCountByCity = async (req, res) => {
  try {
    const city = req.params.city;
    const hotelCount = await NewHotel.countDocuments({ "city": city });
    res.json({ city, hotelCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// get cities alphabetically
exports.getCitiesAlphabetically = async (req, res) => {
  try {
    const cities = await NewHotel.distinct("city");
    const sortedCities = cities.sort();
    res.status(200).json(sortedCities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// get Cities by Country
exports.getCitiesByCountry = async (req, res) => {
  try {
    const { country } = req.params;
    const cities = await NewHotel.distinct("city", { "country": country });
    const sortedCities = cities.sort();
    res.status(200).json({ country, cities: sortedCities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};