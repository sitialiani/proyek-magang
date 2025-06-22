// controllers/mahasiswa/statusController.js
const db = require("../../../models");
const Mahasiswa = db.Mahasiswa;
const PengajuanMagang = db.PengajuanMagang;
const Lowongan = db.Lowongan;
const Perusahaan = db.Perusahaan;

exports.getStatusPengajuan = async (req, res) => {
  try {
    // Gunakan req.user.id sesuai middleware di app.js
    const userId = req.user ? req.user.id : 1; // Fallback ke ID 1 jika tidak ada user

    // Ambil data mahasiswa berdasarkan user login
    const mahasiswa = await Mahasiswa.findOne({
      where: { user_id: userId },
      attributes: ["id"]
    });

    if (!mahasiswa) {
      return res.status(404).send("Data mahasiswa tidak ditemukan.");
    }

    // Ambil semua pengajuan berdasarkan mahasiswa_id
    const pengajuanList = await PengajuanMagang.findAll({
      where: { mahasiswa_id: mahasiswa.id },
      include: [
        {
          model: Lowongan,
          attributes: ["id"],
          include: [
            {
              model: Perusahaan,
              as: 'perusahaanData',
              attributes: ["nama"]
            }
          ]
        }
      ]
    });

    // Format data untuk ditampilkan di view
    const formattedPengajuan = pengajuanList.map((item) => ({
      id: item.id,
      perusahaan: item.Lowongan?.perusahaanData?.nama || "-",
      tanggal: typeof item.tanggal_pengajuan === "string"
        ? item.tanggal_pengajuan.slice(0, 10)
        : new Date(item.tanggal_pengajuan).toISOString().slice(0, 10),
      status: item.status
    }));

    // Hitung total, diajukan, ditolak
    const total = pengajuanList.length;
    const menunggu = pengajuanList.filter(p => p.status === 'diajukan').length;
    const ditolak = pengajuanList.filter(p => p.status === 'ditolak').length;

    res.render("statusPengajuan", {
      pengajuanList: formattedPengajuan,
      total,
      menunggu,
      ditolak
    });

  } catch (err) {
    console.error("ERROR DETAIL:", err);
    res.status(500).send("Terjadi kesalahan saat memuat status pengajuan.");
  }
};
