const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  city: String,
  country: String,
  chain: String,
  type: { type: String },
  about: { type: String },
  stars: { type: Number },
  price: { type: Number },
  typesOfRooms: [String],
  facilities: [String],
  photoUrls: [String],
});

// Middleware to enforce unique combination of name, city, and country
hotelSchema.pre('save', async function (next) {
  const hotel = this;
  const existingHotel = await mongoose.models.NewHotel.findOne({
    name: hotel.name,
    city: hotel.city,
    country: hotel.country
  });
  if (existingHotel && existingHotel._id.toString() !== hotel._id.toString()) {
    const error = new Error('Hotel with this name, city, and country already exists');
    return next(error);
  }
  next();
});

module.exports= mongoose.models.NewHotel || mongoose.model('NewHotel', hotelSchema);