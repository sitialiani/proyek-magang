'use strict';
const express = require('express');
const router = express.Router();

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
/**
 * @route   POST /admin/lowongan-magang
 * @desc    Menangani submit form untuk membuat lowongan magang.
 */
router.post('/lowongan-magang', adminController.buatLowonganMagang);
router.get('/lowongan-magang', adminController.getLowonganMagangPage);
// router.get('/mitra-perusahaan', adminController.getMitraPerusahaanPage);
// router.get('/feedback-perusahaan', adminController.getFeedbackPerusahaanPage);

// --- Rute Konten & Komunikasi ---
// router.get("/pengumuman", adminController.getPengumumanPage);
// router.get('/template-dokumen', adminController.getTemplateDokumenPage);

// --- Rute Pengaturan Sistem ---
router.get('/manajemen-backup', adminController.getManajemenBackupPage);
router.post('/manajemen-backup/create', adminController.createBackup);
router.get('/manajemen-backup/:id/download', adminController.downloadBackup);
router.post('/manajemen-backup/:id/delete', adminController.deleteBackup);


// =================================================================
// --- EKSPOR ROUTER (WAJIB DI AKHIR FILE) ---
// =================================================================
module.exports = router;
