const Router = require("express");
const router = Router();

const {
  fetchChain,
  fetchHotel,
  fetchResort,
  fetchVillas,
} = require("../controllers/fecth-hotel-villa-resort-chain");

router.get("/hotel", fetchHotel);
router.get("/villa", fetchVillas);
router.get("/resort", fetchResort);
router.get("/chain", fetchChain);

module.exports = router;
