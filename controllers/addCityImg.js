const CityImg = require("../Models/city_img");

const add = async (req, res) => {
  try {
    const { country, city, photoUrl } = req.body;
    const newCityImg = new CityImg({ country, city, photoUrl });
    await newCityImg.save();
    res
      .status(201)
      .send({ message: "City image added successfully", cityImg: newCityImg });
  } catch (error) {
    res.status(500).send({ message: "Error adding city image", error });
  }
};

const fetchAllImg = async (req, res) => {
  try {
    const cityImages = await CityImg.find();
    res.status(200).send(cityImages);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving city images", error });
  }
};

const fetchByCity = async (req, res) => {
  try {
    const { city } = req.body;
    console.log(`Searching for images in city: ${city}`); // Debugging log
    const cityImages = await CityImg.find({ city });
    if (cityImages.length === 0) {
      return res
        .status(404)
        .send({ message: "No images found for the specified city" });
    }
    res.status(200).send(cityImages);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error retrieving city images by city", error });
  }
};

const fetchByCountry = async (req, res) => {
  try {
    const { country } = req.body;
    const cityImages = await CityImg.find({ country });
    if (cityImages.length === 0) {
      return res
        .status(404)
        .send({ message: "No images found for the specified country" });
    }
    res.status(200).send(cityImages);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error retrieving city images by country", error });
  }
};

module.exports = { add, fetchAllImg, fetchByCountry, fetchByCity };
