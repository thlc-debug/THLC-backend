const nodemailer = require('nodemailer');

const sendResetEmail = async (mail, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    // host: "smtp.gmail.com",
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
    subject: 'Your Password Reset OTP Code',
    text: `Your OTP code for password reset is ${otp}. This OTP is valid for 2 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendResetEmail;
