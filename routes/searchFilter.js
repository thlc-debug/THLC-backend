const Router = require("express");
const router = Router();

const {
  searchHotels,
  getAllChains,
  getHotelsByChain,
  getHotelCountByChain,
  getSortedHotelByMoreHotelInCountry,
} = require("../controllers/searchController");

router.get("/hotels", searchHotels);

// Route to get all different chains available
router.get("/chains", getAllChains);

// Route to get all hotels for a particular chain
router.get("/chains/:chain/hotels", getHotelsByChain);

// Route to get the count of hotels for a chain
router.get("/chains/:chain/count", getHotelCountByChain);

//Route to get all get Sorted Hotel By More Hotel In Country
router.get("/getHotelByCountry", getSortedHotelByMoreHotelInCountry);

module.exports = router;
