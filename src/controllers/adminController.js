const Lowongan = require('../../models/lowongan');
const Mitra = require('../../models/mitra');
const Pengumuman = require('../../models/pengumuman');
const User = require('../../models/user');

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

// Menampilkan halaman pengumuman admin
exports.getPengumumanPage = async (req, res) => {
    try {
        // Ambil semua pengumuman dari database
        const pengumuman = await Pengumuman.findAll({
            include: [
                {
                    model: User,
                    as: 'Admin',
                    attributes: ['username']
                }
            ],
            order: [['tanggal', 'DESC']]
        });

        res.render('pengumuman_admin', { 
            pengumuman: pengumuman,
            title: 'Manajemen Pengumuman'
        });
    } catch (error) {
        console.error('Error in getPengumumanPage:', error);
        res.status(500).send('Terjadi kesalahan saat memuat halaman pengumuman.');
    }
};

// Menyimpan pengumuman baru
exports.savePengumuman = async (req, res) => {
    try {
        const { judul, tanggal, waktu, isi, kategori, ditujukan_kepada } = req.body;
        const adminUserId = req.user ? req.user.id : 1; // Fallback ke ID 1 untuk testing

        // Validasi input
        if (!judul || !tanggal || !isi || !ditujukan_kepada) {
            return res.status(400).json({ 
                success: false, 
                message: 'Judul, tanggal, isi, dan target pengumuman harus diisi' 
            });
        }

        // Gabungkan tanggal dan waktu
        const tanggalWaktu = waktu ? `${tanggal} ${waktu}:00` : tanggal;

        // Handle file upload
        let lampiranPath = null;
        if (req.file) {
            lampiranPath = `/uploads/pengumuman/${req.file.filename}`;
        }

        // Simpan pengumuman baru
        await Pengumuman.create({
            admin_user_id: adminUserId,
            judul: judul,
            isi: isi,
            tanggal: tanggalWaktu,
            ditujukan_kepada: ditujukan_kepada || 'semua',
            lampiran: lampiranPath
        });

        res.json({ 
            success: true, 
            message: 'Pengumuman berhasil disimpan' 
        });
    } catch (error) {
        console.error('Error in savePengumuman:', error);
        
        // Handle multer errors
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                success: false, 
                message: 'Ukuran file terlalu besar. Maksimal 5MB.' 
            });
        }
        
        if (error.message && error.message.includes('Hanya file')) {
            return res.status(400).json({ 
                success: false, 
                message: error.message 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan saat menyimpan pengumuman' 
        });
    }
};

// Mengupdate pengumuman
exports.updatePengumuman = async (req, res) => {
    try {
        const { id, judul, tanggal, waktu, isi, kategori, ditujukan_kepada } = req.body;

        const pengumuman = await Pengumuman.findByPk(id);

        if (!pengumuman) {
            return res.status(404).json({ 
                success: false, 
                message: 'Pengumuman tidak ditemukan' 
            });
        }

        // Gabungkan tanggal dan waktu
        const tanggalWaktu = waktu ? `${tanggal} ${waktu}:00` : tanggal;

        // Handle file upload
        let lampiranPath = pengumuman.lampiran; // Keep existing lampiran if no new file
        if (req.file) {
            lampiranPath = `/uploads/pengumuman/${req.file.filename}`;
        }

        // Update pengumuman
        await pengumuman.update({
            judul: judul,
            isi: isi,
            tanggal: tanggalWaktu,
            ditujukan_kepada: ditujukan_kepada || 'semua',
            lampiran: lampiranPath
        });

        res.json({ 
            success: true, 
            message: 'Pengumuman berhasil diupdate' 
        });
    } catch (error) {
        console.error('Error in updatePengumuman:', error);
        
        // Handle multer errors
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                success: false, 
                message: 'Ukuran file terlalu besar. Maksimal 5MB.' 
            });
        }
        
        if (error.message && error.message.includes('Hanya file')) {
            return res.status(400).json({ 
                success: false, 
                message: error.message 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan saat mengupdate pengumuman' 
        });
    }
};

// Menghapus pengumuman
exports.deletePengumuman = async (req, res) => {
    try {
        const { id } = req.params;

        const pengumuman = await Pengumuman.findByPk(id);

        if (!pengumuman) {
            return res.status(404).json({ 
                success: false, 
                message: 'Pengumuman tidak ditemukan' 
            });
        }

        await pengumuman.destroy();

        res.json({ 
            success: true, 
            message: 'Pengumuman berhasil dihapus' 
        });
    } catch (error) {
        console.error('Error in deletePengumuman:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan saat menghapus pengumuman' 
        });
    }
};

// Mengambil semua pengumuman untuk API
exports.getAllPengumuman = async (req, res) => {
    try {
        const pengumuman = await Pengumuman.findAll({
            include: [
                {
                    model: User,
                    as: 'Admin',
                    attributes: ['username']
                }
            ],
            order: [['tanggal', 'DESC']]
        });

        res.json({ 
            success: true, 
            data: pengumuman 
        });
    } catch (error) {
        console.error('Error in getAllPengumuman:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan saat mengambil data pengumuman' 
        });
    }
};
