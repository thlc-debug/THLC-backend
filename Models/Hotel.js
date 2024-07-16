const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  phone: { type: String },
  location: {
    city: { type: String },
    country: { type: String },
  },
  review_rating: { type: Number, default: null },
  address: { type: String },
  landmark: { type: String },
  stars: { type: String, enum: ["5", "3"] },
  photoUrls: [{ type: String }],
  type: { type: String },
  facilities: [{ type: String }],
  staffMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  rooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
  ],
  about: { type: String },
});

module.exports = mongoose.models.Hotel || mongoose.model("Hotel", hotelSchema);
