const express = require('express');
const router = express.Router();
const newHotelController = require('../controllers/newHotelController');



// Route to fetch resorts
router.get('/resorts', newHotelController.getResorts);
// Route to fetch hotels
router.get('/hotels', newHotelController.getHotels);

// Fetching sorted countries
router.get('/countries-alphabetical', newHotelController.getCountriesAlphabetically);

// Fetching Hotels by Country
router.get('/hotel-by-country/:country', newHotelController.getHotelsByCountry);

// Fetching Hotel Count by Country
router.get('/hotel-count-country/:country', newHotelController.getHotelCountByCountry);

// Fetching hotels by city
router.get('/hotel-by-city/:city', newHotelController.getHotelsByCity);


// Hotel Count by City
router.get('/hotel-count-city/:city', newHotelController.getHotelCountByCity);

// Fetching sorted cities
router.get('/cities-alphabetical', newHotelController.getCitiesAlphabetically);

// New route for fetching cities by country
router.get('/cities-by-country/:country', newHotelController.getCitiesByCountry);


router.get('/', newHotelController.getAllNewHotels);
router.get('/top-countries', newHotelController.getTopCountriesByHotelCount);
router.get('/names/alphabatical', newHotelController.getHotelNamesAlphabetically);//alphabetical order
router.get('/countries/hotel-count', newHotelController.getCountryNamesSortedByHotelCount);//country name according to hotel count
router.get('/search/:country', newHotelController.getHotelCountByCountry);
router.get('/:id', newHotelController.getNewHotelById);
router.post('/', newHotelController.createNewHotel);
router.put('/:id', newHotelController.updateNewHotel);
router.delete('/:id', newHotelController.deleteNewHotel);




module.exports = router;
