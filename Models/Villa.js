const mongoose = require('mongoose');

const villaSchema = new mongoose.Schema({
  name: { type: String, required: true },
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
  photoUrls: { type: [String], required: true },
}, { timestamps: true });

// Middleware to enforce unique combination of name, location, and country
villaSchema.pre('save', async function (next) {
  const villa = this;
  const existingVilla = await mongoose.models.Villa.findOne({
    name: villa.name,
    location: villa.location,
    country: villa.country
  });
  if (existingVilla && existingVilla._id.toString() !== villa._id.toString()) {
    const error = new Error('Villa with this name, location, and country already exists');
    return next(error);
  }
  next();
});

module.exports = mongoose.models.Villa || mongoose.model('Villa', villaSchema);
