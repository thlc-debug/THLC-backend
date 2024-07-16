const Router = require("express");
const router = Router();

const { contact } = require("../controllers/contact.js");

router.post("/contact", contact);

module.exports = router;
