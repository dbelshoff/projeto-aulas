const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configura o armazenamento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Nome inicial, pode ser sobrescrito depois se necessário
    cb(null, 'tempfile');
  }
});

// Cria o middleware de upload
const upload = multer({ storage });

module.exports = upload;
