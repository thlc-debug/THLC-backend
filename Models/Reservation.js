const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    phone: { type: String, trim: true },
    id_proof: { type: String, trim: true },
    no_of_people: { type: Number, trim: true },
    is_payment_done: { type: Boolean, default: false },
    no_of_days: { type: Number, trim: true },
    check_in: { type: Date, trim: true },
    check_out: { type: Date, trim: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    hotel_id: { type: mongoose.Schema.Types.ObjectId, ref: "NewHotel", required: true },
    room_id: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    price: { type: Number },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Reservation || mongoose.model("Reservation", reservationSchema);