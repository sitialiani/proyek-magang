const express = require('express');
const router = express.Router();

// GET /dosen/pengajuan/:mahasiswaId
router.get('/pengajuan/:mahasiswaId', (req, res) => {
    const mahasiswaId = req.params.mahasiswaId;
    // Nanti di sini Anda akan mengambil data mahasiswa dari database berdasarkan ID
    // Untuk sekarang, kita langsung render halamannya
    res.render('detail_pengajuan'); 
});

module.exports = router;