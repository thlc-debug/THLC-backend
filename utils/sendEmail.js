const nodemailer = require("nodemailer");

const sendEmail = async (mail, otp) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp/gmail.com",
    // port: 587,
    port: 465,
    secure: true, // use TLS
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: mail,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;