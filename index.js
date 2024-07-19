const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const connectDB = require("./Config/dbConnection");
const passport = require('./Config/passport');

// Load environment variables from .env file
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth"); // Authentication routes
const hotelRoute = require("./routes/newHotel"); // Hotel routes
const reservationRoute = require("./routes/reservationRoutes"); // Reservation routes
const authMiddleware = require("./middleware/authMiddleware"); // Authentication middleware
const newHotelRoutes = require("./routes/hotel"); // Add this line
const villaRoutes = require("./routes/villaRoutes");
const fetch_hotel_villa_resort_chain = require("./routes/fetch-hotel-villa-chain-resort"); //to fetch data

const roomsRoute = require("./routes/room"); // rooms
const userRoutes = require("./routes/userRoutes"); // user
const searchRoute = require("./routes/searchFilter"); // to search hotel
const ContactUsRoute = require("./routes/contact"); // contact us form stores here
const transactionRoutes = require("./routes/transactionRoutes");
const cityImg = require("./routes/cityImg");

const port = process.env.PORT || 4000; // Port selection
const app = express(); // Instance of the express server

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(
  cors({
    origin: "*", // Allow requests from any origin
    credentials: true, // Allow sending cookies from the client
  })
);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());


// Connect to the database
connectDB();

// Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/admin/hotel", hotelRoute); // Admin hotel routes
app.use("/admin/room", roomsRoute); // Admin room routes
app.use("/hotel", hotelRoute); // General hotel routes
app.use("/newHotel", newHotelRoutes); // for new hotel schema
app.use("/cityImg", cityImg); // to fetch city img and country img
app.use("/fetch", fetch_hotel_villa_resort_chain); // to fetch fetch_hotel_villa_resort_chain

app.use("/reservation", reservationRoute); // Reservation routes
app.use("/user", userRoutes); // User Routes
app.use("/search", searchRoute); // search hotel Route
app.use("/contact", ContactUsRoute); //contact us (db + mail)

app.use("/api/villas", villaRoutes); //Villa routes

app.use("/api/transactions", transactionRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server started successfully");
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
