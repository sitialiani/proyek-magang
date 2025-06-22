const { Penilaian, Mahasiswa, Dosen, PengajuanMagang, Lowongan } = require('../../../models');

exports.getPenilaianPage = async (req, res) => {
    try {
        // Asumsi ID mahasiswa didapat dari sesi atau middleware
        const mahasiswaUserId = req.user ? req.user.id : 1; // Ganti dengan ID user mahasiswa yang login

        const mahasiswa = await Mahasiswa.findOne({ where: { user_id: mahasiswaUserId } });
        if (!mahasiswa) {
            return res.status(404).render('error', { message: 'Data mahasiswa tidak ditemukan.' });
        }

        const penilaian = await Penilaian.findOne({
            where: { mahasiswa_id: mahasiswa.id },
            include: [{ model: Dosen, attributes: ['nama'] }]
        });

        const pengajuan = await PengajuanMagang.findOne({
            where: { mahasiswa_id: mahasiswa.id, status: 'diterima' },
            include: [{ model: Lowongan, attributes: ['perusahaan'] }]
        });

        let nilaiData = {
            nama: mahasiswa.nama,
            nim: mahasiswa.npm,
            perusahaan: pengajuan ? pengajuan.Lowongan.perusahaan : '-',
            nilai_akhir: null,
            komentar: {},
            dosen_penilai: '-',
            tanggal_penilaian: '-'
        };

        if (penilaian) {
            nilaiData.nilai_akhir = penilaian.nilai_akhir;
            nilaiData.dosen_penilai = penilaian.Dosen ? penilaian.Dosen.nama : 'Dosen Tidak Ditemukan';
            nilaiData.tanggal_penilaian = new Date(penilaian.tanggal).toLocaleDateString('id-ID');
            
            // Parsing komentar
            const komentarParts = penilaian.komentar.split(' | ');
            komentarParts.forEach(part => {
                const [kategori, ...deskripsi] = part.split(': ');
                if (kategori.toLowerCase() === 'kinerja') {
                    nilaiData.komentar.kinerja = deskripsi.join(': ');
                } else if (kategori.toLowerCase() === 'kedisiplinan') {
                    nilaiData.komentar.kedisiplinan = deskripsi.join(': ');
                } else if (kategori.toLowerCase() === 'kolaborasi') {
                    nilaiData.komentar.kolaborasi = deskripsi.join(': ');
                }
            });
        }

        res.render('penilaian', {
            title: 'Hasil Penilaian Magang',
            data: nilaiData
        });

    } catch (error) {
        console.error("Error fetching penilaian:", error);
        res.status(500).send("Terjadi kesalahan saat mengambil data penilaian.");
    }
}; 