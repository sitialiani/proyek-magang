const Lowongan = require('../../models/lowongan');
const Mitra = require('../../models/mitra');

exports.getLowongan = async (req, res) => {
  try {
    const lowongan = await Lowongan.findAll();
    res.render('lowongan_magang', {
      lowongan,
      currentPage: 'lowongan'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal mengambil data lowongan.');
  }
};

exports.tambahLowongan = async (req, res) => {
  try {
    const { judul, perusahaan, lokasi, durasi, deadline, deskripsi } = req.body;
    await Lowongan.create({
      judul,
      perusahaan,
      lokasi,
      durasi,
      deadlinependaftaran: new Date(deadline),
      deskripsi
    });
    res.redirect('/admin/lowongan-magang');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal menambahkan lowongan.');
  }
};

exports.hapusLowongan = async (req, res) => {
  try {
    const id = req.params.id;
    await Lowongan.destroy({ where: { id } });
    res.redirect('/admin/lowongan-magang');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal menghapus lowongan.');
  }
};

exports.getMitra = async (req, res) => {
  try {
    const mitra = await Mitra.findAll();
    res.render('mitra_perusahaan', {
      mitra,
      currentPage: 'mitra'
    });
  } catch (err) {
    console.error("❌ Error ambil mitra:", err);
    res.status(500).send("Gagal ambil data mitra.");
  }
};

// Tambah mitra baru
exports.tambahMitra = async (req, res) => {
  try {
    const { nama, alamat, kontak } = req.body;
    await Mitra.create({ nama, alamat, kontak });
    res.redirect('/admin/mitra-perusahaan');
  } catch (err) {
    console.error("❌ Error tambah mitra:", err);
    res.status(500).send("Gagal menambahkan mitra.");
  }
};

// Hapus mitra
exports.hapusMitra = async (req, res) => {
  try {
    const id = req.params.id;
    await Mitra.destroy({ where: { id } });
    res.redirect('/admin/mitra-perusahaan');
  } catch (err) {
    console.error("❌ Error hapus mitra:", err);
    res.status(500).send("Gagal menghapus mitra.");
  }
};


// Ambil semua mitra dari database
exports.getMitra = async (req, res) => {
  try {
    const mitra = await Mitra.findAll();
    res.render('mitra_perusahaan', {
      mitra,
      currentPage: 'mitra'
    });
  } catch (err) {
    console.error("❌ Error ambil mitra:", err);
    res.status(500).send("Gagal ambil data mitra.");
  }
};

// Tambah mitra baru
exports.tambahMitra = async (req, res) => {
  try {
    const { nama, alamat, kontak } = req.body;
    await Mitra.create({ nama, alamat, kontak });
    res.redirect('/admin/mitra-perusahaan');
  } catch (err) {
    console.error("❌ Error tambah mitra:", err);
    res.status(500).send("Gagal menambahkan mitra.");
  }
};

// Hapus mitra
exports.hapusMitra = async (req, res) => {
  try {
    const id = req.params.id;
    await Mitra.destroy({ where: { id } });
    res.redirect('/admin/mitra-perusahaan');
  } catch (err) {
    console.error("❌ Error hapus mitra:", err);
    res.status(500).send("Gagal menghapus mitra.");
  }
};
