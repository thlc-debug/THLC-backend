const { registerService } = require("../services/authService");
const { REGISTER_SUCCESS } = require("../utils/constants");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");

const registerUser = asyncErrorHandler(async (req, res) => {
  const { username, mail, phone, password, idProof, otp } = req.body;
  const authDetails = await registerService(
    username,
    mail,
    phone,
    password,
    idProof,
    otp
  );
  res.status(REGISTER_SUCCESS.status).json({ token: authDetails.token });
});

module.exports = { registerUser };
