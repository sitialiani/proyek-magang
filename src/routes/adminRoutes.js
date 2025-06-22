'use strict';
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { uploadPengumuman } = require('../config/multer');

// 1. Impor controller
const adminController = require('../controllers/adminController');

// 2. Impor middleware (jika ada nanti, misal untuk upload)
// const upload = require('../../config/multerConfig');


// =================================================================
// --- DEFINISI RUTE ADMIN ---
// Setiap rute sekarang memanggil fungsi dari controller
// =================================================================
// --- Rute Utama & Manajemen Pengguna ---
router.get('/dashboard', adminController.getDashboardPage);
router.get('/manajemen-pengguna', adminController.getManajemenPenggunaPage);
router.post('/manajemen-pengguna', adminController.addUser);
router.put('/manajemen-pengguna/:id/status', adminController.updateUserStatus);
router.put('/manajemen-pengguna/:id/reset-password', adminController.resetUserPassword);
router.put('/manajemen-pengguna/:id', adminController.updateUser);
router.delete('/manajemen-pengguna/:id', adminController.deleteUser);

// --- Rute Proses Magang ---
// router.get('/pengajuan-magang', adminController.getPengajuanMagangPage);
router.get('/progress-magang/export-csv', adminController.exportProgressMagangCSV);
router.get('/progress-magang', adminController.getProgressMagangPage);
router.get('/dosen-pembimbing', adminController.getDosenPembimbingPage);
/**
 * @route   POST /admin/alokasi-pembimbing
 * @desc    Menangani submit form untuk alokasi pembimbing.
 */
router.post('/alokasi-pembimbing', adminController.alokasikanPembimbing);

// --- Rute Kemitraan & Lowongan ---
//tampila,hapus,tambah
router.get('/lowongan-magang', adminController.getLowongan);
router.post('/lowongan/tambah', adminController.tambahLowongan);
router.post('/lowongan/hapus/:id', adminController.hapusLowongan);


// Tampilkan halaman mitra
router.get('/mitra-perusahaan', adminController.getMitra);
router.post('/mitra-perusahaan/tambah', adminController.tambahMitra);
router.post('/mitra-perusahaan/hapus/:id', adminController.hapusMitra);


router.get('/feedback-perusahaan', (req, res) => {
    res.render('feedback_perusahaan', { feedback: feedbackData });
});

// Laporan Statistik
router.get('/laporan-statistik', adminController.getLaporanStatistik);


// --- Rute Konten & Komunikasi ---
router.get("/pengumuman", adminController.getPengumumanPage);

/**
 * @route   POST /admin/pengumuman/save
 * @desc    Menyimpan pengumuman baru.
 */
router.post('/pengumuman/save', uploadPengumuman.single('lampiran'), (err, req, res, next) => {
    if (err) {
        return res.status(400).json({ 
            success: false, 
            message: err.message 
        });
    }
    next();
}, adminController.savePengumuman);

/**
 * @route   PUT /admin/pengumuman/update
 * @desc    Mengupdate pengumuman yang sudah ada.
 */
router.put('/pengumuman/update', uploadPengumuman.single('lampiran'), (err, req, res, next) => {
    if (err) {
        return res.status(400).json({ 
            success: false, 
            message: err.message 
        });
    }
    next();
}, adminController.updatePengumuman);

/**
 * @route   DELETE /admin/pengumuman/delete/:id
 * @desc    Menghapus pengumuman berdasarkan ID.
 */
router.delete('/pengumuman/delete/:id', adminController.deletePengumuman);

/**
 * @route   GET /admin/pengumuman/api/all
 * @desc    Mengambil semua pengumuman untuk API.
 */
router.get('/pengumuman/api/all', adminController.getAllPengumuman);

router.get('/template-dokumen', (req, res) => {
    res.render('template_dokumen', { templates: templateDokumen });
});


// --- Rute Pengaturan Sistem ---
router.get('/manajemen-backup', adminController.getManajemenBackupPage);
router.post('/manajemen-backup/create', adminController.createBackup);
router.get('/manajemen-backup/:id/download', adminController.downloadBackup);
router.post('/manajemen-backup/:id/delete', adminController.deleteBackup);

router.get("/Pengumuman_admin", (req, res) => {
  console.log("Route Pengumuman_admin dipanggil!"); // Tambahkan log ini
  res.render("Pengumuman_admin");
});

router.get("/dashboard_admin", (req, res) => {
  console.log("Route dashboard_admin dipanggil!"); // Tambahkan log ini
  res.render("dashboard_admin");
});

module.exports = router; // <<< WAJIB agar bisa di-require


// =================================================================
// --- EKSPOR ROUTER (WAJIB DI AKHIR FILE) ---
// =================================================================
module.exports = router;
