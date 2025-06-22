const Logbook = require('../../../models/logbook');
const Mahasiswa = require('../../../models/mahasiswa');

// Menampilkan halaman logbook
exports.getLogbookPage = async (req, res) => {
    try {
        res.render('logbook');
    } catch (error) {
        console.error('Error in getLogbookPage:', error);
        res.status(500).send('Terjadi kesalahan saat memuat halaman logbook.');
    }
};

// Menampilkan riwayat logbook
exports.getRiwayatLogbook = async (req, res) => {
    try {
        // Ambil data mahasiswa dari session atau middleware
        const mahasiswaId = req.user ? req.user.id : 1; // Fallback ke ID 1 untuk testing
        
        // Ambil data logbook dari database
        const logbooks = await Logbook.findAll({
            where: { mahasiswa_id: mahasiswaId },
            order: [['tanggal', 'DESC']]
        });

        // Format data untuk view
        const formattedLogbooks = logbooks.map((log, index) => ({
            id: log.id,
            nomor: index + 1,
            tanggal: new Date(log.tanggal).toLocaleDateString('id-ID'),
            aktivitas: log.kegiatan.substring(0, 50) + (log.kegiatan.length > 50 ? '...' : ''),
            deskripsi: log.kegiatan,
            status: log.verifikasi_dosen ? 'Disetujui' : 'Menunggu',
            statusClass: log.verifikasi_dosen ? 'status-approved' : 'status-pending'
        }));

        res.render('RiwayatLogbook', { 
            logbooks: formattedLogbooks,
            title: 'Riwayat Logbook'
        });
    } catch (error) {
        console.error('Error in getRiwayatLogbook:', error);
        res.status(500).send('Terjadi kesalahan saat memuat riwayat logbook.');
    }
};

// Menyimpan logbook baru
exports.saveLogbook = async (req, res) => {
    try {
        const { tanggal, aktivitas, deskripsi } = req.body;
        const mahasiswaId = req.user ? req.user.id : 1; // Fallback ke ID 1 untuk testing

        // Validasi input
        if (!tanggal || !aktivitas || !deskripsi) {
            return res.status(400).json({ 
                success: false, 
                message: 'Semua field harus diisi' 
            });
        }

        // Cek apakah sudah ada logbook untuk tanggal yang sama
        const existingLogbook = await Logbook.findOne({
            where: { 
                mahasiswa_id: mahasiswaId,
                tanggal: tanggal
            }
        });

        if (existingLogbook) {
            return res.status(400).json({ 
                success: false, 
                message: 'Logbook untuk tanggal ini sudah ada' 
            });
        }

        // Simpan logbook baru
        await Logbook.create({
            mahasiswa_id: mahasiswaId,
            tanggal: tanggal,
            kegiatan: deskripsi, // Menggunakan deskripsi sebagai kegiatan
            verifikasi_dosen: false
        });

        res.json({ 
            success: true, 
            message: 'Logbook berhasil disimpan' 
        });
    } catch (error) {
        console.error('Error in saveLogbook:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan saat menyimpan logbook' 
        });
    }
};

// Mengupdate logbook
exports.updateLogbook = async (req, res) => {
    try {
        const { id, tanggal, aktivitas, deskripsi } = req.body;
        const mahasiswaId = req.user ? req.user.id : 1;

        const logbook = await Logbook.findOne({
            where: { 
                id: id,
                mahasiswa_id: mahasiswaId
            }
        });

        if (!logbook) {
            return res.status(404).json({ 
                success: false, 
                message: 'Logbook tidak ditemukan' 
            });
        }

        // Update logbook
        await logbook.update({
            tanggal: tanggal,
            kegiatan: deskripsi
        });

        res.json({ 
            success: true, 
            message: 'Logbook berhasil diupdate' 
        });
    } catch (error) {
        console.error('Error in updateLogbook:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan saat mengupdate logbook' 
        });
    }
};

// Menghapus logbook
exports.deleteLogbook = async (req, res) => {
    try {
        const { id } = req.params;
        const mahasiswaId = req.user ? req.user.id : 1;

        const logbook = await Logbook.findOne({
            where: { 
                id: id,
                mahasiswa_id: mahasiswaId
            }
        });

        if (!logbook) {
            return res.status(404).json({ 
                success: false, 
                message: 'Logbook tidak ditemukan' 
            });
        }

        await logbook.destroy();

        res.json({ 
            success: true, 
            message: 'Logbook berhasil dihapus' 
        });
    } catch (error) {
        console.error('Error in deleteLogbook:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan saat menghapus logbook' 
        });
    }
}; 