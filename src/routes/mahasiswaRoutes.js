'use strict';
const express = require('express');
const router = express.Router();

// 1. Impor controller dan middleware yang dibutuhkan
const mahasiswaController = require('../controllers/mahasiswaController');
const upload = require('../../config/multer');
// const { isLoggedIn } = require('../middleware/auth'); // Aktifkan ini nanti setelah membuat sistem login

// const pengajuanList = Object.values(pengajuanDummy);

// =======================
// ROUTES MAHASISWA
// =======================

const lowonganController = require('../controllers/mahasiswa/lowonganController');
const logbookController = require('../controllers/mahasiswa/logbookController');
const pengumumanController = require('../controllers/mahasiswa/pengumumanController');
const penilaianController = require('../controllers/mahasiswa/penilaianController');
const { upload } = require("../config/multer");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/dashboard", (req, res) => {
  res.render("dashboard-mahasiswa");
});

router.get('/lowongan', lowonganController.getDaftarLowongan);

router.get("/lowongan/:id", lowonganController.getDetailLowongan);

const pengajuanController = require("../controllers/mahasiswa/pengajuanController");

router.get("/formulir/:lowonganId", pengajuanController.getFormPengajuan);
router.get("/formulir/:lowonganId", (req, res) => {
  const lowonganId = req.params.lowonganId;
  res.render("formPengajuan", { lowonganId });
});

// POST formulir pengajuan
router.post(
  "/formulir/:lowonganId",
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "transkrip", maxCount: 1 },
    { name: "dokumen_pendukung", maxCount: 1 },
    { name: "krs", maxCount: 1 }
  ]),
  pengajuanController.postFormPengajuan
);

const statusController = require("../controllers/mahasiswa/statusController");

router.get("/status-pengajuan", statusController.getStatusPengajuan);

const detailPengajuanController = require("../controllers/mahasiswa/detailPengajuanController");

router.get("/pengajuan/:id", detailPengajuanController.getDetailPengajuan);


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
router.get('/logbook', logbookController.getLogbookPage);

/**
 * @route   GET /mahasiswa/riwayatlogbook
 * @desc    Menampilkan halaman riwayat logbook yang telah diisi.
 */
router.get('/riwayatlogbook', logbookController.getRiwayatLogbook);

/**
 * @route   POST /mahasiswa/logbook/save
 * @desc    Menyimpan logbook baru.
 */
router.post('/logbook/save', logbookController.saveLogbook);

/**
 * @route   PUT /mahasiswa/logbook/update
 * @desc    Mengupdate logbook yang sudah ada.
 */
router.put('/logbook/update', logbookController.updateLogbook);

/**
 * @route   DELETE /mahasiswa/logbook/delete/:id
 * @desc    Menghapus logbook berdasarkan ID.
 */
router.delete('/logbook/delete/:id', logbookController.deleteLogbook);

/**
 * @route   GET /mahasiswa/pengumuman
 */
router.get("/pengumuman", pengumumanController.getPengumumanPage);

/**
 * @route   GET /mahasiswa/pengumuman/:id
 * @desc    Mengambil detail pengumuman berdasarkan ID.
 */
router.get("/pengumuman/:id", pengumumanController.getPengumumanDetail);

/**
 * @route   GET /mahasiswa/penilaian
 * @desc    Menampilkan halaman hasil penilaian magang mahasiswa.
 */
router.get("/penilaian", (req, res) => {
    console.log("Route /mahasiswa/penilaian dipanggil!");
    // Pastikan Anda memiliki file view bernama 'penilaian.ejs'
    res.render("penilaian");
});
module.exports = router;
