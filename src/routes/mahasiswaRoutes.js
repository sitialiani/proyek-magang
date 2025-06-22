'use strict';
const express = require('express');
const router = express.Router();

// 1. Impor controller dan middleware yang dibutuhkan
const mahasiswaController = require('../controllers/mahasiswaController');
const upload = require('../../config/multer');
// const { isLoggedIn } = require('../middleware/auth'); // Aktifkan ini nanti setelah membuat sistem login

// --- Data Contoh (nantinya dari database) ---
const laporanData = {
    status: 'Perlu Revisi',
    dosen: 'Dr. Ir. Anjali, S.Kom., M.Kom.',
    catatan: 'Isi catatan revisi dari dosen...',
    tanggalCatatan: '17 Juni 2025' // Tanggal disesuaikan dengan waktu sekarang
};

const riwayatData = [
    {
        id: 1,
        versi: 'v.1',
        namaFile: 'Laporan_Akhir_Budi.pdf',
        tanggal: '15 Juni 2025, 14:30',
        status: 'Direvisi'
    }
];

// =======================
// ROUTES MAHASISWA
// =======================

const lowonganController = require('../controllers/mahasiswa/lowonganController');
const logbookController = require('../controllers/mahasiswa/logbookController');
const pengumumanController = require('../controllers/mahasiswa/pengumumanController');
const penilaianController = require('../controllers/mahasiswa/penilaianController');
const dashboardController = require('../controllers/mahasiswa/dashboardController');
const pengajuanController = require("../controllers/mahasiswa/pengajuanController");
const statusController = require("../controllers/mahasiswa/statusController");
const detailPengajuanController = require("../controllers/mahasiswa/detailPengajuanController");
const { upload } = require("../config/multer");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/dashboard", dashboardController.getDashboard);

router.get('/lowongan', lowonganController.getAllLowongan);

router.get("/lowongan/:id", lowonganController.getDetailLowongan);

// Formulir pengajuan
router.get("/formulir/:lowonganId", pengajuanController.getFormPengajuan);

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

router.get("/status-pengajuan", statusController.getStatusPengajuan);

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

/**
 * @route   GET /mahasiswa/logbook
 */
router.get('/logbook', logbookController.getLogbookPage);

/**
 * @route   GET /mahasiswa/riwayat-logbook
 * @desc    Menampilkan halaman riwayat logbook mahasiswa.
 */
router.get('/riwayat-logbook', logbookController.getRiwayatLogbook);

/**
 * @route   POST /mahasiswa/logbook
 * @desc    Menyimpan logbook baru.
 */
router.post('/logbook', logbookController.postLogbook);

/**
 * @route   POST /mahasiswa/logbook/save
 * @desc    Menyimpan logbook baru via AJAX.
 */
router.post('/logbook/save', logbookController.saveLogbook);

/**
 * @route   PUT /mahasiswa/logbook/update
 * @desc    Mengupdate logbook.
 */
router.put('/logbook/update', logbookController.updateLogbook);

/**
 * @route   DELETE /mahasiswa/logbook/delete/:id
 * @desc    Menghapus logbook.
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

router.get("/penilaian", penilaianController.getPenilaianPage);

// --- Ekspor Router ---
// Wajib ada di baris paling akhir agar semua rute di atas bisa dikenali.
module.exports = router; 
