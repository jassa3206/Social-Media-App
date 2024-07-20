// upload.js
const multer = require('multer');
const path = require('path');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory to temporarily store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file to avoid conflicts
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
