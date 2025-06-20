const { Laporan, Mahasiswa, Dosen, User, Feedback } = require('../../models');

// Fungsi untuk menampilkan halaman Laporan Akhir
exports.getLaporanAkhirPage = async (req, res) => {
    try {
        // Untuk testing, kita tentukan ID mahasiswa secara manual.
        // Nantinya, ID ini akan didapat dari sesi login (req.user.mahasiswaId).
        const mahasiswaId = 1; // Ganti dengan ID yang ada di database lokal Anda

        // 1. Ambil semua riwayat laporan untuk mahasiswa ini
        const riwayat = await Laporan.findAll({
            where: { mahasiswa_id: mahasiswaId },
            order: [['tanggal_upload', 'DESC']]
        });

        // 2. Ambil data laporan terakhir untuk mendapatkan info detail
        // Kita gunakan 'include' untuk melakukan JOIN dan mengambil data Dosen & Feedback
        const laporan = await Laporan.findOne({
            where: { mahasiswa_id: mahasiswaId },
            order: [['tanggal_upload', 'DESC']],
            include: [
                {
                    model: Mahasiswa,
                    include: [{
                        model: Dosen,
                        include: [User] // Untuk mendapatkan nama dosen dari tabel User
                    }]
                },
                {
                    model: Feedback, // Untuk mendapatkan catatan revisi
                    limit: 1,
                    order: [['tanggal', 'DESC']]
                }
            ]
        });

        // 3. Render halaman dengan data dari database
        res.render('laporan_akhir', {
            // Jika tidak ada laporan sama sekali, kirim objek kosong
            laporan: laporan || {}, 
            riwayat: riwayat || []
        });

    } catch (error) {
        console.error("Error saat mengambil data laporan:", error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
};

// Fungsi untuk mengunggah file laporan baru
exports.uploadLaporan = async (req, res) => {
    try {
        const mahasiswaId = req.user.mahasiswaId; // ID dari sesi login

        if (!req.file) {
            return res.status(400).send('File tidak ditemukan.');
        }

        // Simpan informasi file ke database
        await Laporan.create({
            mahasiswaId: mahasiswaId,
            nama_file: req.file.originalname,
            path_file: req.file.path,
            versi: 'v.baru', // Anda bisa membuat logika versi lebih canggih
            status: 'Menunggu Review'
        });

        res.redirect('/mahasiswa/laporan-akhir');
    } catch (error) {
        console.error(error);
        res.status(500).send('Gagal mengunggah file');
    }
};
