const { createUser, checkOTP, deleteOTPRecord } = require("../db/userDb");
const globalValidator = require("../utils/globalValidator");
const registerValidator = require("../validators/registerValidator");

const registerService = async (
  username,
  mail,
  phone,
  password,
  idProof,
  otp
) => {
  if (
    globalValidator(registerValidator, {
      username,
      mail,
      phone,
      password,
      idProof,
      otp,
    })
  ) {
    await checkOTP(otp);
    const newUser = await createUser(username, mail, phone, password, idProof);
    await deleteOTPRecord(mail, otp);
    const token = newUser.generateAuthToken();
    return token;
  }
};

module.exports = { registerService };
