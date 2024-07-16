const uploadCloudinary = require("../Config/cloudinary.js");
const upload = require("../middleware/multerMiddleware.js");
const Room = require("../Models/Room.js");
const NewHotel = require("../Models/newHotel");
// const fileUpload = require("../middleware/multerMiddleware.js");

const createNewRoom = async (req, res) => {
  const { hotel_id } = req.params;
  const img = req.files;
  const roomData = new Room(req.body);

  if (!hotel_id) {
    return res
      .status(400)
      .send({ message: "ID or file  parameter is missing or empty" });
  }

  try {
    const photoUrl = [];
    if (img) {
      for (const i of img) {
        const result = await uploadCloudinary(i.path);
        photoUrl.push(result.secure_url);
      }
    }

    roomData.photoUrls = photoUrl;

    const savedRoom = await roomData.save();

    const hotel = await NewHotel.findByIdAndUpdate(
      hotel_id,
      { $push: { rooms: savedRoom } },
      { new: true, runValidators: true }
    );

    if (!hotel) {
      return res.status(404).send({ message: "NewHotel not found" });
    }

    return res.status(201).send(hotel);
  } catch (error) {
    return res
      .status(400)
      .send({ message: `faild to create new room - ${error}` });
  }
};

const updateRoomStatus = async (req, res) => {
  const { room_id, status } = req.body;

  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      room_id,
      { status },
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res.status(200).json(updatedRoom);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error updating room status: ${error}` });
  }
};

const changeInfoRoom = async (req, res) => {
  // const { roomId } = req.params;
  const { hotelId, roomId } = req.body;
  const updateFields = req.body; // Fields to update

  try {
    // Find the hotel and populate the rooms
    const hotel = await NewHotel.findById(hotelId).populate("rooms");

    if (!hotel) {
      return res.status(404).json({ message: "NewHotel not found" });
    }

    // Find the specific room within the hotel's rooms
    // const room = hotel.rooms.id(roomId);
    const room = hotel.rooms.find((room) => room._id.toString() === roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Update the room's fields
    for (const key in updateFields) {
      room[key] = updateFields[key];
    }

    // Save the hotel document
    await hotel.save();

    return res.status(200).json(room);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error updating room info: ${error}` });
  }
};

const getAllRoomsInHotelWithPopulate = async (req, res) => {
  const { hotelId } = req.body;

  try {
    // Find the hotel and populate its rooms
    const hotel = await NewHotel.findById(hotelId).populate("rooms");

    if (!hotel) {
      return res.status(404).json({ message: "NewHotel not found" });
    }

    // Return all rooms of the hotel
    const rooms = hotel.rooms;

    return res.status(200).json(rooms);
  } catch (error) {
    return res.status(500).json({ message: `Error fetching rooms: ${error}` });
  }
};

const getPerticularRoomStatus = async (req, res) => {
  const { hotelId, roomId } = req.body;
  try {
    // Find the hotel by its ID
    const hotel = await NewHotel.findById(hotelId).populate("rooms");
    // console.log(hotel);

    if (!hotel) {
      return res.status(404).json({ message: "NewHotel not found" });
    }

    // Check if the room exists in the hotel's rooms array
    const room = hotel.rooms.find((room) => room._id.toString() === roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found in this hotel" });
    }

    return res.status(200).json(room.status);
  } catch (error) {
    return res.status(500).json({ message: `Error fetching room: ${error}` });
  }
};

const getPerticularRoomInfo = async (req, res) => {
  const { hotelId, roomId } = req.body;

  try {
    // Find the hotel by its ID
    const hotel = await NewHotel.findById(hotelId).populate("rooms");
    // console.log(hotel);

    if (!hotel) {
      return res.status(404).json({ message: "NewHotel not found" });
    }

    // Check if the room exists in the hotel's rooms array
    const room = hotel.rooms.find((room) => room._id.toString() === roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found in this hotel" });
    }

    return res.status(200).json(room);
  } catch (error) {
    return res.status(500).json({ message: `Error fetching room: ${error}` });
  }
};

const deleteRoom = async (req, res) => {
  const { hotelId, roomId } = req.body;

  try {
    // Find the hotel by its ID and populate the rooms
    const hotel = await NewHotel.findById(hotelId).populate("rooms");

    if (!hotel) {
      return res.status(404).json({ message: "NewHotel not found" });
    }

    // Check if the room exists in the hotel's rooms array
    const room = hotel.rooms.find((room) => room._id.toString() === roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found in this hotel" });
    }

    // Remove the room from the hotel's rooms array
    hotel.rooms.pull(roomId);
    await hotel.save();

    // Delete the room document
    await Room.findByIdAndDelete(roomId);

    return res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Error deleting room: ${error}` });
  }
};

module.exports = {
  createNewRoom,
  updateRoomStatus,
  changeInfoRoom,
  getAllRoomsInHotelWithPopulate,
  getPerticularRoomStatus,
  getPerticularRoomInfo,
  deleteRoom,
};
