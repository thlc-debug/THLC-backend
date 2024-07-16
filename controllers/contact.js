const Contact = require("../Models/Contact");
const sendContactUsMail = require("../utils/sendContactUsMail");

const contact = async (req, res) => {
  const { name, email, msg } = req.body;

  try {
    const contact = new Contact({
      name,
      email,
      msg,
    });

    await contact.save();

    await sendContactUsMail(name, email, msg);

    return res
      .status(201)
      .json({ success: true, message: "Contact saved successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to save contact",
      error: error.message,
    });
  }
};

module.exports = { contact };
