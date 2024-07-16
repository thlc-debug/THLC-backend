const upload = require("../middleware/multerMiddleware.js");
const Router = require("express");
const {
  newHotel,
  deleteHotel,
  getAllHotels,
  getSpecificHotel,
  updateHotel,
} = require("../controllers/newHotel.js");
const router = Router();

router.route("/getHotel").get(getAllHotels);
router.route("/getHotel/:id").get(getSpecificHotel);

// router.route("/newHotel").post(newHotel);

router.post("/newHotel", upload.array("img", 5), newHotel);

router.route("/deleteHotel/:id").delete(deleteHotel);
router.route("/updateHotel/:id").post(updateHotel);

module.exports = router;

// upload.array("img", 3),
