const express = require('express');
const router = express.Router();
const dospemController = require('../controllers/dospemController'); // Pastikan nama file controller sudah dospemController.js

// Middleware otorisasi dummy: hanya izinkan jika req.user ada dan role-nya 'dosen'
function authorizeDosen(req, res, next) {
    if (req.user && req.user.role === 'dosen') {
        next(); // Lanjutkan ke controller
    } else {
        res.status(403).send('Akses ditolak. Anda tidak memiliki izin sebagai Dosen Pembimbing.');
    }
}

// Terapkan middleware otorisasi ke semua rute dospem
router.use(authorizeDosen);

// Item 30: Dashboard Dosen Pembimbing
router.get('/dashboard', dospemController.getDashboard);

// Item 31: Melihat Daftar Mahasiswa Bimbingan
router.get('/mahasiswa', dospemController.getMahasiswaBimbinganList); // Menggunakan fungsi baru
router.get('/mahasiswa/:id', dospemController.getDetailMahasiswa); // Untuk melihat detail 1 mahasiswa

// Item 32: Detail Pengajuan Magang (Simulasi Modal)
router.get('/pengajuan/:id/detail', dospemController.getDetailPengajuanMagangModal); // Detail Pengajuan (seperti modal)
router.get('/pengajuan-magang/:id', (req, res) => { /* Dummy req.user for testing */ req.user = { id: 1 }; dospemController.getDetailPengajuanMagangModal(req, res); });
// Item 33, 34: Melihat dan Mengevaluasi Logbook Mahasiswa
router.get('/evaluasi-logbook', dospemController.getEvaluasiLogbookList); // Daftar Logbook untuk dievaluasi
router.get('/logbook/evaluasi/:logbookId', dospemController.getEvaluasiLogbookFormModal); // Form evaluasi logbook (seperti modal)
router.post('/logbook/evaluasi/:logbookId', dospemController.postEvaluasiLogbook); // Submit evaluasi logbook

// Item 35, 36: Melihat dan Memberi Penilaian Laporan Akhir Mahasiswa
router.get('/penilaian-laporan-akhir', dospemController.getPenilaianLaporanAkhirList); // Daftar Laporan Akhir untuk dinilai
router.get('/laporan-akhir/nilai/:laporanId', dospemController.getPenilaianLaporanFormModal); // Form penilaian laporan (seperti modal)
router.post('/laporan-akhir/nilai/:laporanId', dospemController.postPenilaianLaporan); // Submit penilaian laporan

module.exports = router;