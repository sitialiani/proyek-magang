const Lowongan = require('../../../models/lowongan');
const Perusahaan = require('../../../models/perusahaan');

// Definisikan relasi dengan alias agar bisa dipanggil sebagai "Perusahaan" di EJS
Lowongan.belongsTo(Perusahaan, {
  foreignKey: 'perusahaan_id',
  as: 'Perusahaan'
});

exports.getDaftarLowongan = async (req, res) => {
  try {
    const lowonganList = await Lowongan.findAll({
      include: [
        {
          model: Perusahaan,
          as: 'Perusahaan'
        }
      ]
    });

    // console.log("Berhasil ambil lowonganList:", JSON.stringify(lowonganList, null, 2));
    console.log('Daftar lowongan dikirim ke view:', lowonganList);

    res.render('lowongan', { lowonganList });
  } catch (err) {
    console.error('❌ Gagal ambil data lowongan:', err.message);
    res.status(500).send('Terjadi kesalahan pada server');
  }

  
};

exports.getDetailLowongan = async (req, res) => {
  const lowonganId = req.params.id;

  try {
    const lowongan = await Lowongan.findOne({
      where: { id: lowonganId },
      include: [{ model: Perusahaan }]
    });

    if (!lowongan) {
      return res.status(404).send('Lowongan tidak ditemukan');
    }

    const detail = {
      id: lowongan.id,
      judul: lowongan.judul,
      perusahaan: lowongan.Perusahaan.nama,
      lokasi: lowongan.Perusahaan.alamat,
      deadline: lowongan.tanggal_ditutup,
      deskripsi: lowongan.deskripsi,
    };

    res.render('detailLowongan', { lowongan: detail });
  } catch (err) {
    console.error('Gagal ambil detail lowongan:', err);
    res.status(500).send('Terjadi kesalahan saat memuat detail lowongan');
  }
};
