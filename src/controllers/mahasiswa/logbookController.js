const db = require("../../../models");
const Mahasiswa = db.Mahasiswa;
const Logbook = db.Logbook;

// Menampilkan halaman logbook
exports.getLogbookPage = async (req, res) => {
    try {
        // Perbaiki penanganan session user
        let userId;
        if (req.session && req.session.user && req.session.user.id) {
            userId = req.session.user.id;
        } else {
            // Fallback untuk development - gunakan user_id 2 (Budi Sanjaya)
            userId = 2;
        }
        
        // Ambil data mahasiswa
        const mahasiswa = await Mahasiswa.findOne({
            where: { user_id: userId },
            attributes: ["id", "nama", "npm"]
        });

        // Jika mahasiswa tidak ditemukan, gunakan data default
        const mahasiswaData = mahasiswa ? {
            id: mahasiswa.id,
            nama: mahasiswa.nama,
            npm: mahasiswa.npm
        } : {
            id: 1,
            nama: "Budi Sanjaya",
            npm: "2021001"
        };

        // Jika mahasiswa ditemukan, ambil logbook
        let logbookList = [];
        if (mahasiswa) {
            logbookList = await Logbook.findAll({
                where: { mahasiswa_id: mahasiswa.id },
                order: [['tanggal', 'DESC']]
            });
        }

        res.render("logbook", {
            logbookList: logbookList,
            mahasiswa: mahasiswaData
        });
    } catch (err) {
        console.error("ERROR DETAIL:", err);
        res.status(500).send("Terjadi kesalahan saat memuat logbook.");
    }
};

// Menampilkan riwayat logbook
exports.getRiwayatLogbook = async (req, res) => {
    try {
        // Perbaiki penanganan session user
        let userId;
        if (req.session && req.session.user && req.session.user.id) {
            userId = req.session.user.id;
        } else {
            // Fallback untuk development - gunakan user_id 2 (Budi Sanjaya)
            userId = 2;
        }
        
        // Get mahasiswa data
        const mahasiswa = await Mahasiswa.findOne({
            where: { user_id: userId },
            attributes: ["id", "nama", "npm"]
        });

        // Jika mahasiswa tidak ditemukan, gunakan data default
        const mahasiswaData = mahasiswa ? {
            id: mahasiswa.id,
            nama: mahasiswa.nama,
            npm: mahasiswa.npm
        } : {
            id: 1,
            nama: "Budi Sanjaya",
            npm: "2021001"
        };
        
        // Ambil data logbook dari database
        const logbooks = await Logbook.findAll({
            where: { mahasiswa_id: mahasiswaData.id },
            order: [['tanggal', 'DESC']]
        });

        // Format data untuk view
        const formattedLogbooks = logbooks.map((log, index) => {
            // Parse kegiatan untuk memisahkan aktivitas dan deskripsi
            const kegiatanText = log.kegiatan || '';
            let aktivitas = kegiatanText;
            let deskripsi = '';
            
            // Coba parse jika ada format "aktivitas\n\nDeskripsi:\ndeskripsi"
            if (kegiatanText.includes('\n\nDeskripsi:\n')) {
                const parts = kegiatanText.split('\n\nDeskripsi:\n');
                aktivitas = parts[0] || '';
                deskripsi = parts[1] || '';
            }
            
            return {
                id: log.id,
                nomor: index + 1,
                tanggal: new Date(log.tanggal).toLocaleDateString('id-ID'),
                aktivitas: aktivitas.substring(0, 50) + (aktivitas.length > 50 ? '...' : ''),
                deskripsi: deskripsi || aktivitas, // Jika tidak ada deskripsi terpisah, gunakan aktivitas
                status: log.verifikasi_dosen ? 'Disetujui' : 'Menunggu',
                statusClass: log.verifikasi_dosen ? 'status-approved' : 'status-pending'
            };
        });

        res.render('RiwayatLogbook', { 
            logbooks: formattedLogbooks,
            title: 'Riwayat Logbook',
            mahasiswa: mahasiswaData
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
        
        // Perbaiki penanganan session user
        let userId;
        if (req.session && req.session.user && req.session.user.id) {
            userId = req.session.user.id;
        } else {
            // Fallback untuk development - gunakan user_id 2 (Budi Sanjaya)
            userId = 2;
        }
        
        // Get mahasiswa data
        const mahasiswa = await Mahasiswa.findOne({
            where: { user_id: userId },
            attributes: ["id"]
        });

        // Jika mahasiswa tidak ditemukan, gunakan data default
        const mahasiswaId = mahasiswa ? mahasiswa.id : 1;

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

        // Gabungkan aktivitas dan deskripsi menjadi kegiatan
        const kegiatan = `${aktivitas}\n\nDeskripsi:\n${deskripsi}`;

        // Simpan logbook baru
        await Logbook.create({
            mahasiswa_id: mahasiswaId,
            tanggal: tanggal,
            kegiatan: kegiatan,
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
        
        // Perbaiki penanganan session user
        let userId;
        if (req.session && req.session.user && req.session.user.id) {
            userId = req.session.user.id;
        } else {
            // Fallback untuk development - gunakan user_id 2 (Budi Sanjaya)
            userId = 2;
        }
        
        // Get mahasiswa data
        const mahasiswa = await Mahasiswa.findOne({
            where: { user_id: userId },
            attributes: ["id"]
        });

        // Jika mahasiswa tidak ditemukan, gunakan data default
        const mahasiswaId = mahasiswa ? mahasiswa.id : 1;

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
            kegiatan: `${aktivitas}\n\nDeskripsi:\n${deskripsi}`
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
        
        // Perbaiki penanganan session user
        let userId;
        if (req.session && req.session.user && req.session.user.id) {
            userId = req.session.user.id;
        } else {
            // Fallback untuk development - gunakan user_id 2 (Budi Sanjaya)
            userId = 2;
        }
        
        // Get mahasiswa data
        const mahasiswa = await Mahasiswa.findOne({
            where: { user_id: userId },
            attributes: ["id"]
        });

        // Jika mahasiswa tidak ditemukan, gunakan data default
        const mahasiswaId = mahasiswa ? mahasiswa.id : 1;

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

exports.postLogbook = async (req, res) => {
    try {
        // Perbaiki penanganan session user
        let userId;
        if (req.session && req.session.user && req.session.user.id) {
            userId = req.session.user.id;
        } else {
            // Fallback untuk development - gunakan user_id 2 (Budi Sanjaya)
            userId = 2;
        }

        const { tanggal, aktivitas, output, hambatan, rencana } = req.body;

        // Cari mahasiswa berdasarkan user_id
        const mahasiswa = await Mahasiswa.findOne({ where: { user_id: userId } });

        // Jika mahasiswa tidak ditemukan, gunakan data default
        const mahasiswaId = mahasiswa ? mahasiswa.id : 1;

        // Simpan logbook baru
        await Logbook.create({
            mahasiswa_id: mahasiswaId,
            tanggal: tanggal,
            kegiatan: aktivitas,
            verifikasi_dosen: false
        });

        res.redirect("/mahasiswa/logbook");
    } catch (err) {
        console.error("Gagal menyimpan logbook:", err);
        res.status(500).send("Terjadi kesalahan saat menyimpan logbook");
    }
}; 