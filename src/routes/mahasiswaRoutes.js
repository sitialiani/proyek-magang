const express = require('express');
const router = express.Router();

// Data contoh, nantinya dari database
const laporanData = { status: 'Perlu Revisi', dosen: 'Dr. Ir. Anjali, S.Kom., M.Kom.', catatan: 'Isi catatan revisi dari dosen...', tanggalCatatan: '17 Juni 2025' };
const riwayatData = [ { id: 1, versi: 'v.1', namaFile: 'Laporan_Akhir_Budi.pdf', tanggal: '15 Juni 2025, 14:30', status: 'Direvisi' }];

/**
 * @route   GET /mahasiswa/laporan-akhir
 * @desc    Menampilkan halaman laporan akhir mahasiswa
 */
router.get('/laporan-akhir', (req, res) => {
    // Menggunakan template dari keyword "Mahasiswa-laporan akhir"
    res.render('laporan_akhir', { 
        laporan: laporanData,
        riwayat: riwayatData 
    });
});

module.exports = router;
