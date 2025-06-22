const express = require('express');
const router = express.Router();

// =======================
// DATA DUMMY
// =======================
const laporanData = {
    status: 'Perlu Revisi',
    dosen: 'Dr. Ir. Anjali, S.Kom., M.Kom.',
    catatan: 'Isi catatan revisi dari dosen...',
    tanggalCatatan: '17 Juni 2025'
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


router.get("/laporan-akhir", (req, res) => {
  res.render("laporan_akhir", {
    laporan: laporanData,
    riwayat: riwayatData
  });
});

router.get("/laporan", (req, res) => {
  res.render("laporanakhir");
});

router.get("/logbook", (req, res) => {
  res.render("logbook");
});

router.get("/riwayatlogbook", (req, res) => {
  res.render("riwayatlogbook");
});

router.get("/pengumuman", (req, res) => {
  res.render("pengumuman");
});

router.get("/penilaian", (req, res) => {
  res.render("penilaian");
});

module.exports = router;
