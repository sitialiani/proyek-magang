const express = require('express');
const router = express.Router();

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


// const pengajuanList = Object.values(pengajuanDummy);

// =======================
// ROUTES MAHASISWA
// =======================

const lowonganController = require('../controllers/mahasiswa/lowonganController');

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

const upload = require("../config/multer");

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
 * @desc    Menampilkan halaman laporan akhir mahasiswa dengan data revisi.
 */
router.get('/laporan-akhir', (req, res) => {
    // Merender template `laporan_akhir.ejs` dengan data yang sudah disiapkan.
    res.render('laporan_akhir', {
        laporan: laporanData,
        riwayat: riwayatData
    });
});

/**
 * @route   GET /mahasiswa/laporan
 * @desc    (Alternatif) Menampilkan halaman laporan akhir.
 */
router.get("/laporan", (req, res) => {
    console.log("Route /mahasiswa/laporan dipanggil!");
    // Pastikan Anda memiliki file view bernama 'laporanakhir.ejs'
    res.render("laporanakhir");
});

/**
 * @route   GET /mahasiswa/logbook
 * @desc    Menampilkan halaman untuk mengisi logbook harian.
 */
router.get('/logbook', (req, res) => {
    console.log("Route /mahasiswa/logbook dipanggil!");
    // Pastikan Anda memiliki file view bernama 'logbook.ejs'
    res.render('logbook');
});

/**
 * @route   GET /mahasiswa/riwayatlogbook
 * @desc    Menampilkan halaman riwayat logbook yang telah diisi.
 */
router.get('/riwayatlogbook', (req, res) => {
    console.log("Route /mahasiswa/riwayatlogbook dipanggil!");
    // Pastikan Anda memiliki file view bernama 'riwayatlogbook.ejs'
    res.render('riwayatlogbook');
});

/**
 * @route   GET /mahasiswa/pengumuman
 * @desc    Menampilkan halaman pengumuman untuk mahasiswa.
 */
router.get("/pengumuman", (req, res) => {
    console.log("Route /mahasiswa/pengumuman dipanggil!");
    // Pastikan Anda memiliki file view bernama 'pengumuman.ejs'
    res.render("pengumuman");
});

/**
 * @route   GET /mahasiswa/penilaian
 * @desc    Menampilkan halaman hasil penilaian magang mahasiswa.
 */
router.get("/penilaian", (req, res) => {
    console.log("Route /mahasiswa/penilaian dipanggil!");
    // Pastikan Anda memiliki file view bernama 'penilaian.ejs'
    res.render("penilaian");
});


// --- Ekspor Router ---
// Wajib ada di baris paling akhir agar semua rute di atas bisa dikenali.
module.exports = router;
