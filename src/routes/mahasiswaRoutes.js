'use strict';
const express = require('express');
const router = express.Router();

// 1. Impor controller dan middleware yang dibutuhkan
const mahasiswaController = require('../controllers/mahasiswaController');
const upload = require('../../config/multerConfig');
// const { isLoggedIn } = require('../middleware/auth'); // Aktifkan ini nanti setelah membuat sistem login

// --- Definisi Rute (Routes) ---

/**
 * @route   GET /mahasiswa/laporan-akhir
 * @desc    Menampilkan halaman laporan akhir mahasiswa dengan data dari database.
 */
// PERBAIKAN: Rute ini sekarang memanggil fungsi dari controller
router.get('/laporan-akhir', mahasiswaController.getLaporanAkhirPage);

/**
 * @route   POST /mahasiswa/laporan-akhir/upload
 * @desc    Menangani proses unggah file laporan.
 */
// PERBAIKAN: Rute ini juga memanggil fungsi dari controller
router.post('/laporan-akhir/upload', upload.single('fileLaporan'), mahasiswaController.uploadLaporan);


// --- Rute untuk Halaman Lain (Contoh Placeholder) ---

/**
 * @route   GET /mahasiswa/logbook
 */
router.get('/logbook', (req, res) => {
    // Nantinya ini juga akan memanggil fungsi dari controller
    res.render('logbook'); // Pastikan Anda punya file logbook.ejs
});

/**
 * @route   GET /mahasiswa/pengumuman
 */
router.get("/pengumuman", (req, res) => {
    res.render("pengumuman"); // Pastikan Anda punya file pengumuman.ejs
});


// --- Ekspor Router ---
// Wajib ada di baris paling akhir
module.exports = router;
