const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const wishlistController = require("../controllers/wishlistController");
const authMiddleware = require("../middleware/authMiddleware")

// get details of logged in user
router.get('/details', authMiddleware, userController.getUserDetails);

// Wishlist routes
router.post("/add-to-wishlist", authMiddleware, wishlistController.addToWishlist);
router.get("/wishlist", authMiddleware, wishlistController.getWishlist);
router.delete("/remove-from-wishlist/:hotelId", authMiddleware, wishlistController.removeFromWishlist);


// User routes
router.get("/all", userController.getAllUser);
router.get("/:id", userController.getUser);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);


module.exports = router;
