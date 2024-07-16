const Reservation = require('../Models/Reservation');
const User = require('../Models/User');

// Get a list of all reservations (for admin users)
const getAllReservations = async (req, res) => {
  try {
    // const user_id = req.user_id; // Assumed to be coming from JWT
    // const user = await User.findById(user_id);

    // if (!user || user.accountType !== 'admin') {
    //   return res.status(403).json({ message: 'Access denied' });
    // }

    const reservations = await Reservation.find().populate('hotel_id').populate('room_id');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get details of a specific reservation
const getReservationDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id).populate('hotel_id').populate('room_id');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all reservations of a user
const getAllReservationsByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Check if the user exists
    // const user = await User.findById(user_id);

    // if (!user) {
    //   return res.status(404).json({ message: 'User not found' });
    // }

    // Retrieve reservations of the user
    const reservations = await Reservation.find({ user_id }).populate('hotel_id').populate('room_id');
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all reservations of a hotel
const getAllReservationsByHotel = async (req, res) => {
  const { hotel_id } = req.params;

  try {
    const reservations = await Reservation.find({ hotel_id }).populate('hotel_id').populate('room_id');
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get total earnings of a hotel on a particular date
const getHotelEarnings = async (req, res) => {
  const { hotel_id, date } = req.params;
  const startDate = new Date(date);
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + 1); // Set end date to the next day to get the entire day's data

  try {
    const reservations = await Reservation.find({
      hotel_id,
      check_in: { $gte: startDate, $lt: endDate }
    });

    const totalEarnings = reservations.reduce((total, reservation) => total + reservation.price, 0);
    res.status(200).json({ totalEarnings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new reservation
const createReservation = async (req, res) => {
  try {
    const {
      user_id, name, email, phone, id_proof, no_of_people, no_of_days, check_in, check_out,
      hotel_id, room_id, price, is_payment_done, status
    } = req.body;

    // const user_id = req.user_id; // Assumed to be coming from JWT

    const reservation = new Reservation({
      user_id,
      name,
      email,
      phone,
      id_proof,
      no_of_people,
      no_of_days,
      check_in,
      check_out,
      hotel_id,
      room_id,
      price,
      is_payment_done,
      status
    });

    await reservation.save();

    // Update user's booking history
    await User.findByIdAndUpdate(user_id, { $push: { bookingHistory: reservation._id } });

    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a reservation
const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const reservation = await Reservation.findByIdAndUpdate(id, updates, { new: true });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Cancel a reservation
const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    await Reservation.findByIdAndDelete(id);
    res.json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  getAllReservations,
  getReservationDetails,
  getAllReservationsByUser,
  getAllReservationsByHotel,
  getHotelEarnings,
  createReservation,
  updateReservation,
  cancelReservation,
};
