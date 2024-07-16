const Router = require("express");
const router = Router();
const upload = require("../middleware/multerMiddleware.js");
// const multer = require("multer");
// const upload = multer({ dest: "./public/temp" });

const {
  createNewRoom,
  updateRoomStatus,
  changeInfoRoom,
  getAllRoomsInHotelWithPopulate,
  getPerticularRoomInfo,
  getPerticularRoomStatus,
  deleteRoom,
} = require("../controllers/createNewRoom.js");

// router.post("/hotel/:hotel_id/room", upload.array("photos", 3), createNewRoom);
router.post("/hotel/:hotel_id/room", upload.array("img", 3), createNewRoom);
router.post("/hotel/updateRoomStatus", updateRoomStatus);
router.post("/hotel/changeRoomInfo", changeInfoRoom);
router.get(
  "/hotel/getAllRoomsInHotelWithPopulate",
  getAllRoomsInHotelWithPopulate
);
router.get("/hotel/getPerticularRoomStatus", getPerticularRoomStatus);
router.get("/hotel/getPerticularRoom", getPerticularRoomInfo);
// router.route("/deleteRoom").delete(deleteRoom);
router.post("/deleteRoom", deleteRoom);

module.exports = router;
