const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    type: { type: String, trim: true },
    category: { type: String, trim: true },
    description: { type: String, trim: true },
    no_of_rooms: { type: Number, default: 1 },
    no_of_beds: { type: Number, default: 1 },
    ac: { type: Boolean, default: false },
    window_view: { type: Boolean, default: false },
    balcony: { type: Boolean, default: false },
    price: { type: Number, required: true },
    availability: { type: Boolean, required: true, default: true },
    photoUrls: [{ type: String }],
    status: { type: String, enum: ["booked", "free"], default: "free" },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Room || mongoose.model("Room", roomSchema);
