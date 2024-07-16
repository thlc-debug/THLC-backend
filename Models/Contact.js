const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true },
  msg: { type: String },
});

module.exports = mongoose.models.Contact || mongoose.model("Contact", contactSchema);
