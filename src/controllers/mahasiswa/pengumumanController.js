const Pengumuman = require('../../../models/pengumuman');
const User = require('../../../models/user');

// Menampilkan halaman pengumuman mahasiswa
exports.getPengumumanPage = async (req, res) => {
    try {
        // Ambil pengumuman yang ditujukan untuk mahasiswa atau semua
        const pengumuman = await Pengumuman.findAll({
            where: {
                ditujukan_kepada: ['mahasiswa', 'semua']
            },
            include: [
                {
                    model: User,
                    as: 'Admin',
                    attributes: ['username']
                }
            ],
            order: [['tanggal', 'DESC']]
        });

        // Format data untuk view
        const formattedPengumuman = pengumuman.map(peng => ({
            id: peng.id,
            judul: peng.judul,
            isi: peng.isi,
            tanggal: new Date(peng.tanggal).toLocaleDateString('id-ID'),
            waktu: new Date(peng.tanggal).toLocaleTimeString('id-ID', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            admin: peng.Admin ? peng.Admin.username : 'Admin Sistem',
            kategori: peng.ditujukan_kepada,
            lampiran: peng.lampiran
        }));

        res.render('pengumuman', { 
            pengumuman: formattedPengumuman,
            title: 'Pengumuman'
        });
    } catch (error) {
        console.error('Error in getPengumumanPage:', error);
        res.status(500).send('Terjadi kesalahan saat memuat halaman pengumuman.');
    }
};

// Mengambil detail pengumuman berdasarkan ID
exports.getPengumumanDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const pengumuman = await Pengumuman.findOne({
            where: { 
                id: id,
                ditujukan_kepada: ['mahasiswa', 'semua']
            },
            include: [
                {
                    model: User,
                    as: 'Admin',
                    attributes: ['username']
                }
            ]
        });

        if (!pengumuman) {
            return res.status(404).json({ 
                success: false, 
                message: 'Pengumuman tidak ditemukan' 
            });
        }

        const formattedPengumuman = {
            id: pengumuman.id,
            judul: pengumuman.judul,
            isi: pengumuman.isi,
            tanggal: new Date(pengumuman.tanggal).toLocaleDateString('id-ID'),
            waktu: new Date(pengumuman.tanggal).toLocaleTimeString('id-ID', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            admin: pengumuman.Admin ? pengumuman.Admin.username : 'Admin Sistem',
            kategori: pengumuman.ditujukan_kepada,
            lampiran: pengumuman.lampiran
        };

        res.json({ 
            success: true, 
            data: formattedPengumuman 
        });
    } catch (error) {
        console.error('Error in getPengumumanDetail:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan saat mengambil detail pengumuman' 
        });
    }
}; 