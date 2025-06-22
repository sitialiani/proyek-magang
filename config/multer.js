const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tentukan path folder tujuan
const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'laporan');

// Pastikan direktori tujuan ada, jika tidak, buat direktorinya
// Ini akan mencegah error ENOENT secara otomatis
fs.mkdirSync(uploadDir, { recursive: true });

// Konfigurasi penyimpanan
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Arahkan ke folder yang sudah kita pastikan ada
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Buat nama file yang unik untuk mencegah tumpang tindih
    // contoh: laporan-168748392-fileasli.pdf
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'laporan-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/pengajuan"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

// Filter untuk hanya menerima file PDF
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Hanya file PDF yang diizinkan!'), false);
    }
};


const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 10 // Batas ukuran file 10 MB
    }
});

module.exports = upload;
