// src/controllers/mahasiswaController.js

// Pastikan Anda mengimpor semua model yang dibutuhkan
const { Laporan, Mahasiswa, Dosen, User, Feedback } = require('../../models');

exports.getLaporanAkhirPage = async (req, res) => {
    try {
        // Ambil data mahasiswa berdasarkan user yang login
        const userId = req.user ? req.user.id : 1; // Fallback untuk testing
        
        const mahasiswa = await Mahasiswa.findOne({
            where: { user_id: userId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['email']
                },
                {
                    model: Dosen,
                    as: 'dosen',
                    attributes: ['nama']
                }
            ]
        });

        if (!mahasiswa) {
            return res.status(404).send('Data mahasiswa tidak ditemukan');
        }

        const mahasiswaId = mahasiswa.id;

        const riwayat = await Laporan.findAll({
            where: { mahasiswa_id: mahasiswaId }, // Gunakan snake_case sesuai database
            order: [['tanggal_upload', 'DESC']] // Gunakan snake_case sesuai database
        });

        const laporan = await Laporan.findOne({
            where: { mahasiswa_id: mahasiswaId }, // Gunakan snake_case sesuai database
            order: [['tanggal_upload', 'DESC']],
            include: [
                {
                    model: Mahasiswa,
                    as: 'mahasiswa',
                    include: [{
                        model: Dosen,
                        as: 'dosen'
                    }]
                },
                {
                    model: Feedback,
                    as: 'feedbacks',
                    limit: 1,
                    order: [['tanggal', 'DESC']]
                }
            ]
        });

        res.render('laporan_akhir', {
            mahasiswa: mahasiswa, // Kirim data mahasiswa ke view
            laporan: laporan || {},
            riwayat: riwayat || []
        });

    } catch (error) {
        console.error("Error saat mengambil data laporan:", error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
};

exports.uploadLaporan = async (req, res) => {
    try {
        // Ambil data mahasiswa berdasarkan user yang login
        const userId = req.user ? req.user.id : 1; // Fallback untuk testing
        
        const mahasiswa = await Mahasiswa.findOne({
            where: { user_id: userId }
        });

        if (!mahasiswa) {
            return res.status(404).send('Data mahasiswa tidak ditemukan');
        }

        const mahasiswaId = mahasiswa.id;
        const { judul } = req.body; 

        if (!req.file) {
            return res.status(400).send('Mohon pilih file untuk diunggah.');
        }
        if (!judul || judul.trim() === '') {
            return res.status(400).send('Judul laporan tidak boleh kosong.');
        }
        
        await Laporan.create({
            mahasiswa_id: mahasiswaId, // Gunakan snake_case sesuai database
            judul: judul,
            file_path: req.file.path, // Gunakan snake_case sesuai database
            status: 'menunggu',
            tanggal_upload: new Date(), // Gunakan snake_case sesuai database
            versi: 'v' + Date.now() 
        });

        res.redirect('/mahasiswa/laporan-akhir');
    } catch (error) {
        console.error("Error di uploadLaporan:", error);
        res.status(500).send('Gagal mengunggah file');
    }
};
