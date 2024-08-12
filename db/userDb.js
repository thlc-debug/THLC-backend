const Otp = require("../Models/Otp");
const User = require("../Models/User");
const { UNAUTHORIZED } = require("../utils/constants");
const customError = require("../utils/customError");

const createUser = async (username, mail, phone, password, idProof) => {
  const newUser = new User({
    username,
    mail,
    phone,
    password,
    idProof,
  });
  await newUser.save();
  return newUser;
};

const checkOTP = async (otp) => {
  const otpRecord = await Otp.findOne({ mail, otp });
  if (!otpRecord) {
    throw new customError(UNAUTHORIZED.message, UNAUTHORIZED.status);
  }
};

const deleteOTPRecord = async (mail, otp) => {
  await Otp.deleteOne({ mail, otp });
};

module.exports = { createUser, checkOTP, deleteOTPRecord };
