const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET_KEY,
});

const uploadCloudinary = async (url) => {
  try {
    if (!url) {
      return res.status(404).send("photo url not found");
    }
    const response = await cloudinary.uploader.upload(url, {
      resorce_type: "auto",
    });

    fs.unlinkSync(url);
    return response;
  } catch (error) {
    fs.unlinkSync(url);
    return res.status(500).send("faild to upload photo", error);
  }
};

module.exports = uploadCloudinary;
