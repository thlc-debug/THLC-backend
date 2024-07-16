const newHotel = require("../Models/newHotel");

const fetchHotel = async (req, res) => {
  try {
    const query = { type: "Hotel" };
    const hotels = await newHotel.find(query);

    res.json(hotels);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data from MongoDB");
  }
};

const fetchVillas = async (req, res) => {
  try {
    const query = { type: "Villa" };
    const hotels = await newHotel.find(query);

    res.json(hotels);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data from MongoDB");
  }
};

const fetchResort = async (req, res) => {
  try {
    const query = { type: "Resort" };
    const hotels = await newHotel.find(query);

    res.json(hotels);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data from MongoDB");
  }
};

const fetchChain = async (req, res) => {
  try {
    const hotels = await newHotel.find({ chain: "_unique" });

    res.json(hotels);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data from MongoDB");
  }
};


module.exports = { fetchChain, fetchHotel, fetchResort, fetchVillas };
