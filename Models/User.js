const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  mail: { type: String, required: true, trim: true, unique: true },
  phone: { type: String, trim: true, default: null },
  password: { type: String, required: true },
  rating: { type: Number, default: null },
  bookingHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
    },
  ],
  accountType: {
    type: String,
    enum: ["staff", "admin", "guest"],
    required: true,
  },
  idProof: { type: String, trim: true },
  worker_of: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    default: null,
  },
  lastLoggedIn: { type: Date, default: null }, // Track last login time
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel", // Ensure this matches the `newHotel` model reference
    },
  ]
}, { timestamps: true });

// Hash password before saving user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Password hashed successfully");
    next();
  } catch (err) {
    console.error("Error while hashing password:", err);
    next(err);
  }
});

// Compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log(`Password match result: ${isMatch}`);
    return isMatch;
  } catch (err) {
    console.error('Error comparing passwords:', err);
    throw err;
  }
};

// Generate JWT
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { id: this._id, accountType: this.accountType },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  return token;
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
