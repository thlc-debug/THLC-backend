const mongoose = require("mongoose");
const cityImgSchema = new mongoose.Schema({
  country: { type: String },
  city: { type: String },
  photoUrl: { type: String },
});

module.exports =
  mongoose.models.CityImg || mongoose.model("CityImg", cityImgSchema);
