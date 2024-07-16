const Router = require("express");
const router = Router();

const {
  add,
  fetchAllImg,
  fetchByCountry,
  fetchByCity,
} = require("../controllers/addCityImg");

router.post("/add", add);
router.get("/fetchAllImg", fetchAllImg);
router.get("/fetchByCountry", fetchByCountry);
router.get("/fetchByCity", fetchByCity);

module.exports = router;
