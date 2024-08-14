const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllReservations,
  getReservationDetails,
  getAllReservationsByUser,
  getAllReservationsByHotel,
  getHotelEarnings,
  createReservation,
  updateReservation,
  cancelReservation,
  getPendingReservationCount,
  getConfirmedReservationCount,
  getRecentReservationCount
} = require('../controllers/reservationController');


router.get('/', getAllReservations);                              // Get all reservations (for admin users)

router.get('/details/:id', getReservationDetails);                // Get details of a specific reservation

router.get('/user/:user_id', getAllReservationsByUser);           // Get all reservations of a user

router.get('/hotel/:hotel_id', getAllReservationsByHotel);        // Get all reservations of a hotel

router.get('/hotel/:hotel_id/earnings/:date', getHotelEarnings);  // Get total earnings of a hotel on a particular date

router.post('/create', createReservation);                        // Make a new booking

router.put('/update/:id', updateReservation);                            // Update a reservation

router.delete('/delete/:id', cancelReservation);                         // Cancel a booking

router.get('/pending-count',getPendingReservationCount);     // get the count for pending reservation count

router.get('/confirmed-count', getConfirmedReservationCount);   // get the count for confirmed reservation count

router.get('/recent-count', getRecentReservationCount);

module.exports = router;
