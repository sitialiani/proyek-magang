const Lowongan = require('../../../models/lowongan');
const Perusahaan = require('../../../models/perusahaan');

exports.getDaftarLowongan = async (req, res) => {
  try {
    const lowonganList = await Lowongan.findAll({
      include: [{
        model: Perusahaan,
        as: 'perusahaanData'
      }]
    });
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
      include: [{ 
        model: Perusahaan, 
        as: 'perusahaanData' 
      }]
    });

    if (!lowongan) {
      return res.status(404).send('Lowongan tidak ditemukan');
    }

    res.render('detailLowongan', { lowongan });
  } catch (err) {
    console.error('Gagal ambil detail lowongan:', err);
    res.status(500).send('Terjadi kesalahan saat memuat detail lowongan');
  }
};
