const express = require("express");
const router = express.Router();

// Halaman utama (landing page)
router.get("/", (req, res) => {
  res.render("index");
});

// Halaman dashboard mahasiswa
router.get("/dashboard", (req, res) => {
  res.render("dashboard-mahasiswa");
});

// Halaman daftar lowongan
router.get("/lowongan", (req, res) => {
  console.log("Halaman lowongan dibuka");
  res.render("lowongan");
});

// Halaman formulir pengajuan magang
router.get("/formulir", (req, res) => {
  console.log("Formulir dibuka");
  res.render("formPengajuan");
});

// Halaman detail lowongan magang
router.get("/lowongan/:id", (req, res) => {
  const { id } = req.params;

  // Contoh data dummy
  const lowonganList = [
    {
      id: "1",
      posisi: "Frontend Developer",
      perusahaan: "PT Teknologi Hebat",
      lokasi: "Jakarta",
      deskripsi: "Mengembangkan antarmuka web responsif menggunakan React.js dan Tailwind CSS.",
      kualifikasi: "Mahasiswa semester 5 ke atas jurusan Teknik Informatika / SI.",
      kontak: "hr@teknologihebat.co.id"
    },
    {
      id: "2",
      posisi: "UI/UX Designer",
      perusahaan: "CV Kreatif Digital",
      lokasi: "Bandung",
      deskripsi: "Membuat desain wireframe dan prototipe untuk aplikasi mobile.",
      kualifikasi: "Menguasai Figma, Adobe XD, dan desain interaktif.",
      kontak: "rekrutmen@kreatifdigital.id"
    }
  ];

  // Temukan lowongan berdasarkan ID
  const lowongan = lowonganList.find(l => l.id === id);

  if (!lowongan) {
    return res.status(404).send("Lowongan tidak ditemukan.");
  }

  res.render("detail-lowongan", { lowongan });
});

// Halaman Status Pengajuan
router.get("/status-pengajuan", (req, res) => {
  const pengajuanList = [
    { id: 1, perusahaan: "PT Teknologi Nusantara", tanggal: "2025-06-10", status: "Menunggu" },
    { id: 2, perusahaan: "PT Data Solusi", tanggal: "2025-06-12", status: "Ditolak" },
    { id: 3, perusahaan: "PT Desain Kreatif", tanggal: "2025-06-13", status: "Diterima" },
    { id: 4, perusahaan: "PT Awan Cerah", tanggal: "2025-06-14", status: "Menunggu" },
    { id: 5, perusahaan: "PT Inovasi Digital", tanggal: "2025-06-15", status: "Menunggu" }
  ];

  res.render("statuspengajuan", { pengajuanList });
});

// Detail pengajuan
router.get("/pengajuan/:id", (req, res) => {
  const id = req.params.id;

  const pengajuanDummy = {
    1: { id: 1, perusahaan: "PT Teknologi Nusantara", deskripsi: "Frontend Developer", status: "Menunggu" },
    2: { id: 2, perusahaan: "PT Data Solusi", deskripsi: "Data Analyst", status: "Ditolak" },
    3: { id: 3, perusahaan: "PT Desain Kreatif", deskripsi: "UI/UX Designer", status: "Diterima" },
    4: { id: 4, perusahaan: "PT Awan Cerah", deskripsi: "Cloud Engineer", status: "Menunggu" },
    5: { id: 5, perusahaan: "PT Inovasi Digital", deskripsi: "Backend Developer", status: "Menunggu" }
  };

  const detail = pengajuanDummy[id];

  if (detail) {
    res.render("detailPengajuan", { detail });
  } else {
    res.status(404).send("Pengajuan tidak ditemukan");
  }
});

module.exports = router;
