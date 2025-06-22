// controllers/mahasiswa/pengajuanController.js
const db = require("../../../models");

const Mahasiswa = db.Mahasiswa;
const PengajuanMagang = db.PengajuanMagang;

const path = require("path");

exports.getFormPengajuan = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const lowonganId = req.params.lowonganId; // Ambil dari URL

    const mahasiswa = await Mahasiswa.findOne({
      where: { user_id: userId },
      attributes: ["nama", "npm", "no_hp"]
    });

    if (!mahasiswa) {
      return res.status(404).send("Data mahasiswa tidak ditemukan.");
    }

    // Kirim juga lowonganId ke view
    res.render("formPengajuan", { mahasiswa, lowonganId });
  } catch (err) {
    console.error("ERROR DETAIL:", err);
    res.status(500).send("Terjadi kesalahan saat memuat formulir");
  }
};

exports.postFormPengajuan = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const lowonganId = req.params.lowonganId;

    // Cari mahasiswa berdasarkan user_id
    const mahasiswa = await Mahasiswa.findOne({ where: { user_id: userId } });

    if (!mahasiswa) {
      return res.status(404).send("Mahasiswa tidak ditemukan");
    }

    // Ambil nama file dari file yang diunggah
    const cv = req.files["cv"]?.[0]?.filename || null;
    const transkrip = req.files["transkrip"]?.[0]?.filename || null;
    const dokumenPendukung = req.files["dokumen_pendukung"]?.[0]?.filename || null;
    const krs = req.files["krs"]?.[0]?.filename || null;

    // Simpan ke tabel pengajuan_magang
    await PengajuanMagang.create({
      mahasiswa_id: mahasiswa.id,
      lowongan_id: lowonganId,
      tanggal_pengajuan: new Date(),
      status: "diajukan",
      cv,
      transkrip,
      dokumen_pendukung: dokumenPendukung,
      krs
    });

    res.redirect("/mahasiswa/status-pengajuan");
  } catch (err) {
    console.error("Gagal mengajukan magang:", err);
    res.status(500).send("Terjadi kesalahan saat menyimpan data pengajuan");
  }
};
