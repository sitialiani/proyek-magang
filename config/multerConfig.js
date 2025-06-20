const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Simpan file di folder public/uploads/laporan
    cb(null, 'public/uploads/laporan');
  },
  filename: function (req, file, cb) {
    // Buat nama file yang unik untuk mencegah tumpang tindih
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'laporan-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

module.exports = upload;