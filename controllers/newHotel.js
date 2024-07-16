const Hotel = require("../Models/Hotel");
const Room = require("../Models/Room.js");
const uploadCloudinary = require("../Config/cloudinary.js");

const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).send(hotels);
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

const getSpecificHotel = async (req, res) => {
  //id = hotel id to identify each hotel separatly
  const { id } = req.params;

  if (!id || id.length === 0) {
    return res.status(400).send({ message: "input is missing or empty" });
  }

  try {
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.status(404).send({ message: "Hotel not found" });
    }
    res.status(200).send(hotel);
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

const newHotel = async (req, res) => {
  const img = req.files;
  let hotelData = new Hotel(req.body);

  const photoUrl = [];

  if (img) {
    for (const i of img) {
      const result = await uploadCloudinary(i.path);
      photoUrl.push(result.secure_url);
    }
    hotelData.photoUrls = photoUrl;
  }

  try {
    const data = await hotelData.save();
    return res.status(201).send(data);
  } catch (err) {
    return res.status(400).send(err + " this is error");
  }
};

const deleteHotel = async (req, res) => {
  //id = hotel id to identify each hotel separatly

  const { id } = req.params;

  if (!id) {
    return res.status(400).send({ message: "Input is missing or empty" });
  }

  try {
    const deletedHotel = await Hotel.findByIdAndDelete(id);
    if (!deletedHotel) {
      return res.status(404).send({ message: "Hotel not found" });
    }
    res.status(200).send({ message: "Hotel deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

const updateHotel = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "email",
    "phone",
    "location",
    "review_rating",
    "address",
    "landmark",
    "stars",
    "staffMembers",
    "rooms",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).send({ error: "Hotel not found!" });
    }

    updates.forEach((update) => (hotel[update] = req.body[update]));
    await hotel.save();

    return res.send(hotel);
  } catch (error) {
    return res
      .status(400)
      .send({ error: `Failed to update hotel details - ${error.message}` });
  }
};

module.exports = {
  getAllHotels,
  getSpecificHotel,
  newHotel,
  deleteHotel,
  updateHotel,
};
