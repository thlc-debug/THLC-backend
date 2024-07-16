const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;

// const fileUpload = require("fileupload").createFileUpload({
//   uploadDir: "./uploads",
//   uploadUrl: "/uploads",
//   maxFileSize: 100 * 1024 * 1024, // 100 MB
// });

// module.exports = fileUpload;
