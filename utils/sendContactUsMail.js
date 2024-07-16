const nodemailer = require("nodemailer");

const sendContactUsMail = async (name, email, msg) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    // host: "smtp/gmail.com",
    port: 465,
    secure: true, // use TLS
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.CONTACT_US_EMAIL,
    subject: "Contact Form Submission",
    text: `You have received a new contact form submission.
      Name: ${name}
      Email: ${email}
      Message: ${msg}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendContactUsMail;