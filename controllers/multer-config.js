const fs = require('fs');
const path = require('path');

// Check if the uploads directory exists, if not create it
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // Create the directory if it doesn't exist
}

const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Use the uploads directory
    console.log('File type2:', file.mimetype); 
  },
  
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use unique file name
    console.log('File type:', file.mimetype); 
  },
 
});

const upload = multer({ storage });

module.exports = upload;
